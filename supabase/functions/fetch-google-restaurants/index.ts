
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    weekday_text: string[];
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Places API key not found')
    }

    // Search for restaurants in Cambutal
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Cambutal+Panama&key=${googleApiKey}`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status !== 'OK') {
      throw new Error(`Google Places API error: ${searchData.status}`)
    }

    const restaurants = []

    // Get detailed information for each restaurant
    for (const place of searchData.results) {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,name,formatted_address,formatted_phone_number,website,photos,opening_hours,geometry,types,rating,user_ratings_total&key=${googleApiKey}`
        
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        if (detailsData.status === 'OK') {
          const details: PlaceDetails = detailsData.result

          // Parse opening hours into our format
          const hours: Record<string, string> = {}
          if (details.opening_hours?.weekday_text) {
            details.opening_hours.weekday_text.forEach(dayText => {
              const [day, timeRange] = dayText.split(': ')
              if (day && timeRange) {
                // Normalize day names to match our format
                const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
                hours[normalizedDay] = timeRange === 'Closed' ? 'Closed' : timeRange
              }
            })
          }

          // Get the main photo URL if available
          let imageUrl = null
          if (details.photos && details.photos.length > 0) {
            const photoReference = details.photos[0].photo_reference
            imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${googleApiKey}`
          }

          // Create restaurant object
          const restaurant = {
            name: details.name,
            description: `A restaurant in Cambutal with ${details.user_ratings_total || 0} Google reviews${details.rating ? ` and a ${details.rating} star rating` : ''}.`,
            category: 'Restaurant',
            address: details.formatted_address || 'Cambutal, Panama',
            phone: details.formatted_phone_number || null,
            website: details.website || null,
            whatsapp: null, // Not available from Google Places
            email: null, // Not available from Google Places
            image_url: imageUrl,
            hours: hours,
            gallery_images: [],
            menu_images: [],
            latitude: details.geometry?.location?.lat || null,
            longitude: details.geometry?.location?.lng || null,
            approved: true, // Auto-approve Google Places imports
            user_id: '00000000-0000-0000-0000-000000000000' // System user
          }

          restaurants.push(restaurant)
        }
      } catch (error) {
        console.error(`Error fetching details for place ${place.place_id}:`, error)
        continue
      }
    }

    // Insert restaurants into the database
    let insertedCount = 0
    for (const restaurant of restaurants) {
      try {
        // Check if restaurant already exists by name
        const { data: existing } = await supabaseClient
          .from('restaurant_listings')
          .select('id')
          .eq('name', restaurant.name)
          .single()

        if (!existing) {
          const { error } = await supabaseClient
            .from('restaurant_listings')
            .insert(restaurant)

          if (error) {
            console.error('Error inserting restaurant:', error)
          } else {
            insertedCount++
          }
        }
      } catch (error) {
        console.error('Error processing restaurant:', error)
        continue
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${insertedCount} restaurants from Google Places`,
        totalFound: restaurants.length,
        inserted: insertedCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
