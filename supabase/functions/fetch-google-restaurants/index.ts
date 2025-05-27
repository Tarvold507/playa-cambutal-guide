
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Starting Google Places API fetch for Cambutal restaurants...');

    // Search for restaurants in Cambutal, Panama
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.set('query', 'restaurants in Cambutal Panama');
    searchUrl.searchParams.set('type', 'restaurant');
    searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK') {
      console.error('Google Places API error:', searchData);
      return new Response(JSON.stringify({ error: 'Google Places API error', details: searchData }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${searchData.results.length} restaurants`);

    const processedRestaurants = [];

    // Process each restaurant
    for (const place of searchData.results) {
      try {
        console.log(`Processing restaurant: ${place.name}`);

        // Get detailed information for each place
        const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailsUrl.searchParams.set('place_id', place.place_id);
        detailsUrl.searchParams.set('fields', 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,photos,types,geometry');
        detailsUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

        const detailsResponse = await fetch(detailsUrl.toString());
        const detailsData = await detailsResponse.json();

        if (detailsData.status !== 'OK') {
          console.warn(`Failed to get details for ${place.name}:`, detailsData.status);
          continue;
        }

        const placeDetails: GooglePlace = detailsData.result;

        // Transform Google data to our schema
        const category = mapGoogleTypeToCategory(placeDetails.types);
        const hours = transformOpeningHours(placeDetails.opening_hours?.weekday_text);
        
        // Download and store images
        const galleryImages = await downloadPlacePhotos(placeDetails, supabase);

        // Check if restaurant already exists
        const { data: existingRestaurant } = await supabase
          .from('restaurant_listings')
          .select('id')
          .eq('name', placeDetails.name)
          .eq('address', placeDetails.formatted_address)
          .single();

        if (existingRestaurant) {
          console.log(`Restaurant ${placeDetails.name} already exists, skipping...`);
          continue;
        }

        // Create restaurant listing
        const restaurantData = {
          name: placeDetails.name,
          description: `Restaurant in Cambutal, Panama imported from Google Places.`,
          category: category,
          address: placeDetails.formatted_address,
          phone: placeDetails.formatted_phone_number || null,
          website: placeDetails.website || null,
          hours: hours,
          gallery_images: galleryImages,
          image_url: galleryImages[0] || null,
          approved: false, // Require admin approval
          user_id: '00000000-0000-0000-0000-000000000000', // System user ID
        };

        const { data: newRestaurant, error } = await supabase
          .from('restaurant_listings')
          .insert(restaurantData)
          .select()
          .single();

        if (error) {
          console.error(`Failed to insert restaurant ${placeDetails.name}:`, error);
          continue;
        }

        processedRestaurants.push({
          name: placeDetails.name,
          id: newRestaurant.id,
          status: 'imported'
        });

        console.log(`Successfully imported: ${placeDetails.name}`);

      } catch (error) {
        console.error(`Error processing restaurant ${place.name}:`, error);
        continue;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      imported: processedRestaurants.length,
      restaurants: processedRestaurants
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-google-restaurants function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapGoogleTypeToCategory(types: string[]): string {
  const categoryMap: Record<string, string> = {
    'restaurant': 'Restaurant',
    'bar': 'Bar',
    'cafe': 'Cafe',
    'bakery': 'Bakery',
    'meal_takeaway': 'Takeaway',
    'food': 'Restaurant',
    'establishment': 'Restaurant'
  };

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type];
    }
  }
  
  return 'Restaurant'; // Default category
}

function transformOpeningHours(weekdayText?: string[]): Record<string, string> {
  if (!weekdayText) return {};

  const hours: Record<string, string> = {};
  const dayMap: Record<string, string> = {
    'Monday': 'monday',
    'Tuesday': 'tuesday', 
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday',
    'Sunday': 'sunday'
  };

  for (const dayText of weekdayText) {
    const [day, time] = dayText.split(': ');
    const normalizedDay = dayMap[day];
    if (normalizedDay) {
      hours[normalizedDay] = time === 'Closed' ? 'Closed' : time;
    }
  }

  return hours;
}

async function downloadPlacePhotos(place: GooglePlace, supabase: any): Promise<string[]> {
  const images: string[] = [];
  
  if (!place.photos || place.photos.length === 0) {
    return images;
  }

  // Limit to first 5 photos to avoid excessive API calls
  const photosToProcess = place.photos.slice(0, 5);

  for (let i = 0; i < photosToProcess.length; i++) {
    try {
      const photo = photosToProcess[i];
      const photoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
      photoUrl.searchParams.set('maxwidth', '800');
      photoUrl.searchParams.set('photo_reference', photo.photo_reference);
      photoUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

      const photoResponse = await fetch(photoUrl.toString());
      
      if (photoResponse.ok) {
        const photoBlob = await photoResponse.blob();
        const fileName = `${place.place_id}_${i}.jpg`;
        const filePath = `restaurants/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, photoBlob, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Failed to upload photo ${i} for ${place.name}:`, uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath);

        images.push(publicUrl);
        console.log(`Uploaded photo ${i + 1} for ${place.name}`);
      }
    } catch (error) {
      console.error(`Error downloading photo ${i} for ${place.name}:`, error);
      continue;
    }
  }

  return images;
}
