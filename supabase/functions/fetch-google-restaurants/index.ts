
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
    console.log('Starting Google Places API fetch for Cambutal restaurants...');

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Authentication required',
        details: 'You must be logged in to import restaurants.'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      console.error('Google Places API key not found');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Google Places API key not configured',
        details: 'Please add your Google Places API key in the Supabase Edge Functions secrets.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with user's auth token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Authentication failed',
        details: 'Unable to verify user identity.'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Import initiated by user:', user.id);

    // Search for restaurants in Cambutal, Panama
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.set('query', 'restaurants in Cambutal Panama');
    searchUrl.searchParams.set('type', 'restaurant');
    searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

    console.log('Making request to Google Places API...');
    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    console.log('Google Places API response status:', searchData.status);

    if (searchData.status === 'REQUEST_DENIED') {
      console.error('Google Places API request denied:', searchData);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Google Places API request denied',
        details: 'Your API key has restrictions that prevent server-side usage. Please configure your Google Places API key to allow requests from any HTTP referrer or remove HTTP referrer restrictions.',
        help: 'Go to Google Cloud Console > APIs & Services > Credentials > Edit your API key > Remove HTTP referrer restrictions or add * as an allowed referrer.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (searchData.status !== 'OK') {
      console.error('Google Places API error:', searchData);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Google Places API error', 
        details: searchData.error_message || `Status: ${searchData.status}`
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${searchData.results.length} restaurants`);

    if (!searchData.results || searchData.results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        imported: 0,
        restaurants: [],
        message: 'No restaurants found in Cambutal, Panama area.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processedRestaurants = [];
    const errors = [];

    // Process each restaurant (limit to first 5 to avoid timeout)
    const restaurantsToProcess = searchData.results.slice(0, 5);
    
    for (const place of restaurantsToProcess) {
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
          errors.push(`Failed to get details for ${place.name}: ${detailsData.status}`);
          continue;
        }

        const placeDetails: GooglePlace = detailsData.result;

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

        // Transform Google data to our schema
        const category = mapGoogleTypeToCategory(placeDetails.types);
        const hours = transformOpeningHours(placeDetails.opening_hours?.weekday_text);
        
        // Download and store images (limit to 2 images for faster processing)
        const galleryImages = await downloadPlacePhotos(placeDetails, supabase, 2);

        // Create restaurant listing with the authenticated user's ID
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
          user_id: user.id, // Use authenticated user's ID
        };

        console.log(`Inserting restaurant ${placeDetails.name} with user_id: ${user.id}`);

        const { data: newRestaurant, error } = await supabase
          .from('restaurant_listings')
          .insert(restaurantData)
          .select()
          .single();

        if (error) {
          console.error(`Failed to insert restaurant ${placeDetails.name}:`, error);
          errors.push(`Failed to insert ${placeDetails.name}: ${error.message}`);
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
        errors.push(`Error processing ${place.name}: ${error.message}`);
        continue;
      }
    }

    const response = {
      success: processedRestaurants.length > 0,
      imported: processedRestaurants.length,
      restaurants: processedRestaurants,
      total_found: searchData.results.length,
      processed: restaurantsToProcess.length
    };

    // Add error details if there were any
    if (errors.length > 0) {
      response.details = `Imported ${processedRestaurants.length} restaurants successfully. Errors: ${errors.join(', ')}`;
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-google-restaurants function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    }), {
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

async function downloadPlacePhotos(place: GooglePlace, supabase: any, maxPhotos: number = 2): Promise<string[]> {
  const images: string[] = [];
  
  if (!place.photos || place.photos.length === 0) {
    return images;
  }

  // Limit photos to avoid timeout
  const photosToProcess = place.photos.slice(0, maxPhotos);

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
