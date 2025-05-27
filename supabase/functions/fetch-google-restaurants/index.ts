
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
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
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
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

interface SearchQuery {
  query: string;
  type?: string;
}

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Multiple search queries for comprehensive coverage
const SEARCH_QUERIES: SearchQuery[] = [
  { query: 'restaurants in Cambutal Panama', type: 'restaurant' },
  { query: 'cafes in Cambutal Panama', type: 'cafe' },
  { query: 'bars in Cambutal Panama', type: 'bar' },
  { query: 'food in Cambutal Panama', type: 'food' },
  { query: 'restaurants near Cambutal Los Santos Panama', type: 'restaurant' },
  { query: 'dining Playa Cambutal Panama', type: 'restaurant' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting comprehensive Google Places API fetch for Cambutal restaurants...');

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
        details: 'Please add your Google Places API key in the Supabase Edge Functions secrets.',
        help: 'Go to Google Cloud Console > APIs & Services > Credentials > Edit your API key > Remove HTTP referrer restrictions or add * as an allowed referrer.'
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

    // Collect all unique places from multiple searches
    const allPlaces = new Map<string, GooglePlace>();
    let totalFound = 0;

    for (const searchQuery of SEARCH_QUERIES) {
      try {
        console.log(`Searching for: ${searchQuery.query}`);
        
        const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        searchUrl.searchParams.set('query', searchQuery.query);
        if (searchQuery.type) {
          searchUrl.searchParams.set('type', searchQuery.type);
        }
        searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

        const searchResponse = await fetch(searchUrl.toString());
        const searchData = await searchResponse.json();

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

        if (searchData.status === 'OK' && searchData.results) {
          totalFound += searchData.results.length;
          
          // Add unique places to our collection
          for (const place of searchData.results) {
            if (!allPlaces.has(place.place_id)) {
              allPlaces.set(place.place_id, place);
            }
          }
          
          console.log(`Found ${searchData.results.length} places for "${searchQuery.query}"`);
        }
      } catch (error) {
        console.error(`Error searching for "${searchQuery.query}":`, error);
        continue;
      }
    }

    const uniquePlaces = Array.from(allPlaces.values());
    console.log(`Total unique places found: ${uniquePlaces.length} from ${totalFound} total results`);

    if (uniquePlaces.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        imported: 0,
        restaurants: [],
        total_found: totalFound,
        message: 'No restaurants found in Cambutal, Panama area across all search queries.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processedRestaurants = [];
    const errors = [];

    // Process places (increased limit to 25 for better coverage)
    const placesToProcess = uniquePlaces.slice(0, 25);
    
    for (const place of placesToProcess) {
      try {
        console.log(`Processing restaurant: ${place.name} (${place.place_id})`);

        // Get detailed information with enhanced fields
        const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailsUrl.searchParams.set('place_id', place.place_id);
        detailsUrl.searchParams.set('fields', 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,photos,types,geometry,reviews');
        detailsUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

        const detailsResponse = await fetch(detailsUrl.toString());
        const detailsData = await detailsResponse.json();

        if (detailsData.status !== 'OK') {
          console.warn(`Failed to get details for ${place.name}:`, detailsData.status);
          errors.push(`Failed to get details for ${place.name}: ${detailsData.status}`);
          continue;
        }

        const placeDetails: GooglePlace = detailsData.result;

        // Enhanced duplicate checking
        const { data: existingRestaurant } = await supabase
          .from('restaurant_listings')
          .select('id, name, address')
          .or(`name.ilike.${placeDetails.name.replace(/'/g, "''")},and(name.ilike.%${placeDetails.name.split(' ')[0]}%,address.ilike.%${placeDetails.formatted_address.split(',')[0]}%)`)
          .maybeSingle();

        if (existingRestaurant) {
          console.log(`Restaurant similar to ${placeDetails.name} already exists (${existingRestaurant.name}), skipping...`);
          continue;
        }

        // Enhanced category mapping
        const category = mapGoogleTypeToCategory(placeDetails.types);
        
        // Improved hours processing
        const hours = transformOpeningHours(placeDetails.opening_hours?.weekday_text, placeDetails.opening_hours?.periods);
        
        // Enhanced description generation
        const description = generateDescription(placeDetails);

        // Download and store images with proper error handling
        const galleryImages = await downloadPlacePhotos(placeDetails, supabase, 4);

        // Create restaurant listing with enhanced data
        const restaurantData = {
          name: placeDetails.name,
          description: description,
          category: category,
          address: placeDetails.formatted_address,
          phone: placeDetails.formatted_phone_number || null,
          website: placeDetails.website || null,
          hours: hours,
          gallery_images: galleryImages,
          image_url: galleryImages[0] || null,
          approved: false, // Require admin approval
          user_id: user.id,
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
          status: 'imported',
          rating: placeDetails.rating,
          review_count: placeDetails.user_ratings_total,
          photos_imported: galleryImages.length
        });

        console.log(`Successfully imported: ${placeDetails.name} (Rating: ${placeDetails.rating || 'N/A'}, Reviews: ${placeDetails.user_ratings_total || 0}, Photos: ${galleryImages.length})`);

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
      total_found: totalFound,
      unique_places: uniquePlaces.length,
      processed: placesToProcess.length,
      search_queries_used: SEARCH_QUERIES.length
    };

    // Add detailed results
    if (errors.length > 0) {
      response.details = `Imported ${processedRestaurants.length} restaurants successfully. ${errors.length} errors occurred.`;
      response.errors = errors;
    } else {
      response.details = `Successfully imported ${processedRestaurants.length} restaurants from ${uniquePlaces.length} unique places found.`;
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
    'bar': 'Bar & Tapas',
    'cafe': 'Cafe',
    'bakery': 'Bakery',
    'meal_takeaway': 'Takeaway',
    'meal_delivery': 'Delivery',
    'food': 'Restaurant',
    'night_club': 'Bar & Tapas',
    'establishment': 'Restaurant',
    'lodging': 'Hotel Restaurant'
  };

  // Prioritize more specific types
  const priorityOrder = ['restaurant', 'bar', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery'];
  
  for (const priority of priorityOrder) {
    if (types.includes(priority) && categoryMap[priority]) {
      return categoryMap[priority];
    }
  }

  // Fallback to any matching type
  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type];
    }
  }
  
  return 'Restaurant'; // Default category
}

function transformOpeningHours(weekdayText?: string[], periods?: Array<any>): Record<string, string> {
  const hours: Record<string, string> = {};
  
  if (!weekdayText && !periods) return hours;

  const dayMap: Record<string, string> = {
    'Monday': 'monday',
    'Tuesday': 'tuesday', 
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday',
    'Sunday': 'sunday'
  };

  // Process weekday text first (more reliable)
  if (weekdayText) {
    for (const dayText of weekdayText) {
      try {
        const [day, time] = dayText.split(': ');
        const normalizedDay = dayMap[day];
        if (normalizedDay) {
          if (time === 'Closed') {
            hours[normalizedDay] = 'Closed';
          } else if (time === 'Open 24 hours') {
            hours[normalizedDay] = '24 hours';
          } else {
            // Clean up time format
            const cleanTime = time.replace(/\u202f/g, ' ').replace(/\u2013/g, '-');
            hours[normalizedDay] = cleanTime;
          }
        }
      } catch (error) {
        console.warn(`Error parsing hours for day: ${dayText}`, error);
        continue;
      }
    }
  }

  // Fill in any missing days as 'Hours vary' if we have some data
  if (Object.keys(hours).length > 0 && Object.keys(hours).length < 7) {
    for (const [, normalizedDay] of Object.entries(dayMap)) {
      if (!hours[normalizedDay]) {
        hours[normalizedDay] = 'Hours vary';
      }
    }
  }

  return hours;
}

function generateDescription(place: GooglePlace): string {
  const parts = [];
  
  // Base description
  parts.push(`Restaurant in Cambutal, Panama`);
  
  // Add rating info if available
  if (place.rating) {
    const ratingText = `Rated ${place.rating} stars`;
    if (place.user_ratings_total) {
      parts.push(`${ratingText} by ${place.user_ratings_total} customers`);
    } else {
      parts.push(ratingText);
    }
  }
  
  // Add price level if available
  if (place.price_level !== undefined) {
    const priceTexts = ['Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    if (place.price_level >= 0 && place.price_level < priceTexts.length) {
      parts.push(`${priceTexts[place.price_level]} dining`);
    }
  }
  
  // Add specialties based on types
  const specialties = [];
  if (place.types.includes('seafood_restaurant')) specialties.push('seafood');
  if (place.types.includes('pizza_restaurant')) specialties.push('pizza');
  if (place.types.includes('cafe')) specialties.push('coffee and light meals');
  if (place.types.includes('bar')) specialties.push('drinks and appetizers');
  
  if (specialties.length > 0) {
    parts.push(`Specializing in ${specialties.join(', ')}`);
  }
  
  return parts.join('. ') + '.';
}

async function downloadPlacePhotos(place: GooglePlace, supabase: any, maxPhotos: number = 4): Promise<string[]> {
  const images: string[] = [];
  
  if (!place.photos || place.photos.length === 0) {
    console.log(`No photos available for ${place.name}`);
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

      console.log(`Downloading photo ${i + 1} for ${place.name}`);
      const photoResponse = await fetch(photoUrl.toString());
      
      if (photoResponse.ok) {
        const photoBlob = await photoResponse.blob();
        // Fix: Use place.place_id instead of undefined variable
        const fileName = `${place.place_id}_${i}_${Date.now()}.jpg`;
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
        console.log(`Successfully uploaded photo ${i + 1} for ${place.name}`);
      } else {
        console.warn(`Failed to download photo ${i} for ${place.name}: ${photoResponse.status}`);
      }
    } catch (error) {
      console.error(`Error downloading photo ${i} for ${place.name}:`, error);
      continue;
    }
  }

  console.log(`Successfully imported ${images.length} photos for ${place.name}`);
  return images;
}
