
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

interface SearchLocation {
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Enhanced search locations with more precise Cambutal coordinates
const SEARCH_LOCATIONS: SearchLocation[] = [
  { name: 'Cambutal Beach', lat: 7.31671, lng: -80.48333, radius: 3000 },
  { name: 'Cambutal Village', lat: 7.31500, lng: -80.48500, radius: 2000 },
  { name: 'Guanico', lat: 7.4167, lng: -80.5, radius: 2000 },
  { name: 'Horcones', lat: 7.25, lng: -80.45, radius: 1500 },
];

const PLACE_TYPES = ['restaurant', 'bar', 'cafe', 'meal_takeaway', 'food'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Google Places API fetch...');

    // Parse request body to check for specific restaurant name
    let requestBody;
    try {
      const text = await req.text();
      requestBody = text ? JSON.parse(text) : {};
    } catch {
      requestBody = {};
    }

    const specificRestaurantName = requestBody.restaurantName;
    console.log('Request details:', { specificRestaurantName, hasBody: !!requestBody });

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
      console.error('Google Places API key not found in environment variables');
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

    console.log('Google Places API key found, length:', GOOGLE_PLACES_API_KEY.length);

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

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

    let allPlaces = new Map<string, GooglePlace>();
    let totalFound = 0;
    const searchResults = [];

    if (specificRestaurantName) {
      // Search for specific restaurant by name
      console.log(`Searching for specific restaurant: ${specificRestaurantName}`);
      
      for (const location of SEARCH_LOCATIONS) {
        try {
          const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
          searchUrl.searchParams.set('query', `${specificRestaurantName} restaurant ${location.name} Panama`);
          searchUrl.searchParams.set('location', `${location.lat},${location.lng}`);
          searchUrl.searchParams.set('radius', '5000');
          searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

          console.log(`Text search URL: ${searchUrl.toString()}`);
          const searchResponse = await fetch(searchUrl.toString());
          const searchData = await searchResponse.json();

          console.log(`Text search response status: ${searchData.status}`);
          console.log(`Text search results count: ${searchData.results?.length || 0}`);

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
            for (const place of searchData.results) {
              console.log(`Found place: ${place.name} - Types: ${place.types.join(', ')}`);
              allPlaces.set(place.place_id, place);
              totalFound++;
            }
          }
        } catch (error) {
          console.error(`Error in text search near ${location.name}:`, error);
        }
      }
    } else {
      // Original location-based search
      console.log('Starting location-based search for restaurants...');
      
      for (const location of SEARCH_LOCATIONS) {
        for (const placeType of PLACE_TYPES) {
          try {
            console.log(`Searching for ${placeType} near ${location.name} (${location.lat}, ${location.lng})`);
            
            const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
            searchUrl.searchParams.set('location', `${location.lat},${location.lng}`);
            searchUrl.searchParams.set('radius', location.radius.toString());
            searchUrl.searchParams.set('type', placeType);
            searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY!);

            const searchResponse = await fetch(searchUrl.toString());
            const searchData = await searchResponse.json();

            console.log(`Search ${placeType} near ${location.name}: Status=${searchData.status}, Results=${searchData.results?.length || 0}`);

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
              const locationResults = searchData.results.length;
              totalFound += locationResults;
              
              for (const place of searchData.results) {
                console.log(`Found: ${place.name} - Types: ${place.types.join(', ')} - Rating: ${place.rating || 'N/A'}`);
                
                // Less restrictive filtering - just check if it has food-related types
                if (hasValidFoodType(place.types)) {
                  allPlaces.set(place.place_id, place);
                  console.log(`Added to collection: ${place.name}`);
                } else {
                  console.log(`Filtered out: ${place.name} (no valid food types)`);
                }
              }
              
              searchResults.push({
                location: location.name,
                type: placeType,
                found: locationResults
              });
            }
          } catch (error) {
            console.error(`Error searching for ${placeType} near ${location.name}:`, error);
          }
        }
      }
    }

    const uniquePlaces = Array.from(allPlaces.values());
    console.log(`Total places in collection: ${uniquePlaces.length} from ${totalFound} total results`);

    if (uniquePlaces.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        imported: 0,
        restaurants: [],
        total_found: totalFound,
        search_breakdown: searchResults,
        message: specificRestaurantName 
          ? `No restaurants found matching "${specificRestaurantName}" in the Cambutal area.`
          : 'No restaurants found in the specified Cambutal area locations.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processedRestaurants = [];
    const errors = [];

    // Process all found places
    for (const place of uniquePlaces) {
      try {
        console.log(`Processing: ${place.name} (${place.place_id})`);

        // Get detailed information
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

        // Check for existing restaurant with more lenient matching
        const { data: existingRestaurant } = await supabase
          .from('restaurant_listings')
          .select('id, name, address')
          .or(`name.ilike.%${placeDetails.name.replace(/'/g, "''")}%,address.ilike.%${placeDetails.formatted_address.split(',')[0]}%`)
          .maybeSingle();

        if (existingRestaurant) {
          console.log(`Restaurant similar to ${placeDetails.name} already exists, skipping...`);
          continue;
        }

        const category = mapGoogleTypeToCategory(placeDetails.types);
        const hours = transformOpeningHours(placeDetails.opening_hours?.weekday_text, placeDetails.opening_hours?.periods);
        const description = generateDescription(placeDetails);

        // Download photos with error handling
        const galleryImages = await downloadPlacePhotos(placeDetails, supabase, 3);

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
          approved: false,
          user_id: user.id,
        };

        console.log(`Inserting restaurant: ${placeDetails.name}`);

        const { data: newRestaurant, error } = await supabase
          .from('restaurant_listings')
          .insert(restaurantData)
          .select()
          .single();

        if (error) {
          console.error(`Failed to insert ${placeDetails.name}:`, error);
          errors.push(`Failed to insert ${placeDetails.name}: ${error.message}`);
          continue;
        }

        processedRestaurants.push({
          name: placeDetails.name,
          id: newRestaurant.id,
          status: 'imported',
          rating: placeDetails.rating,
          review_count: placeDetails.user_ratings_total,
          photos_imported: galleryImages.length,
          address: placeDetails.formatted_address
        });

        console.log(`Successfully imported: ${placeDetails.name}`);

      } catch (error) {
        console.error(`Error processing ${place.name}:`, error);
        errors.push(`Error processing ${place.name}: ${error.message}`);
      }
    }

    const response = {
      success: processedRestaurants.length > 0,
      imported: processedRestaurants.length,
      restaurants: processedRestaurants,
      total_found: totalFound,
      unique_places: uniquePlaces.length,
      processed: uniquePlaces.length,
      search_breakdown: searchResults,
      locations_searched: SEARCH_LOCATIONS.map(l => l.name),
      search_type: specificRestaurantName ? 'name_based' : 'location_based'
    };

    if (errors.length > 0) {
      response.details = `Imported ${processedRestaurants.length} restaurants. ${errors.length} errors occurred.`;
      response.errors = errors;
    } else {
      response.details = `Successfully imported ${processedRestaurants.length} restaurants from ${uniquePlaces.length} unique places found.`;
    }

    console.log('Final response:', response);

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

// Simplified validation - just check for food-related types
function hasValidFoodType(types: string[]): boolean {
  const foodTypes = ['restaurant', 'bar', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery', 'food'];
  return types.some(type => foodTypes.includes(type));
}

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
  };

  const priorityOrder = ['restaurant', 'bar', 'cafe', 'bakery', 'meal_takeaway'];
  
  for (const priority of priorityOrder) {
    if (types.includes(priority) && categoryMap[priority]) {
      return categoryMap[priority];
    }
  }

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type];
    }
  }
  
  return 'Restaurant';
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
            const cleanTime = time.replace(/\u202f/g, ' ').replace(/\u2013/g, '-');
            hours[normalizedDay] = cleanTime;
          }
        }
      } catch (error) {
        console.warn(`Error parsing hours: ${dayText}`, error);
      }
    }
  }

  return hours;
}

function generateDescription(place: GooglePlace): string {
  const parts = [];
  
  let location = 'Cambutal area, Panama';
  if (place.formatted_address) {
    const address = place.formatted_address.toLowerCase();
    if (address.includes('cambutal')) location = 'Cambutal, Panama';
    else if (address.includes('guanico')) location = 'Guanico, Panama';
    else if (address.includes('horcones')) location = 'Horcones, Panama';
  }
  
  parts.push(`Restaurant in ${location}`);
  
  if (place.rating) {
    const ratingText = `Rated ${place.rating} stars`;
    if (place.user_ratings_total) {
      parts.push(`${ratingText} by ${place.user_ratings_total} customers`);
    } else {
      parts.push(ratingText);
    }
  }
  
  if (place.price_level !== undefined) {
    const priceTexts = ['Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    if (place.price_level >= 0 && place.price_level < priceTexts.length) {
      parts.push(`${priceTexts[place.price_level]} dining`);
    }
  }
  
  return parts.join('. ') + '.';
}

async function downloadPlacePhotos(place: GooglePlace, supabase: any, maxPhotos: number = 3): Promise<string[]> {
  const images: string[] = [];
  
  if (!place.photos || place.photos.length === 0) {
    console.log(`No photos available for ${place.name}`);
    return images;
  }

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
        const fileName = `${place.place_id}_${i}_${Date.now()}.jpg`;
        const filePath = `restaurants/${fileName}`;

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
    }
  }

  return images;
}
