
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminData = () => {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  const [pendingHotels, setPendingHotels] = useState<any[]>([]);

  const fetchPendingItems = async () => {
    try {
      console.log('Fetching pending items...');
      
      // Fetch pending events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_user_id_fkey (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      console.log('Pending events query result:', { events, eventsError });

      if (eventsError) {
        console.error('Events error:', eventsError);
        setPendingEvents([]);
      } else {
        setPendingEvents(events || []);
      }

      // Fetch pending businesses
      const { data: businesses, error: businessError } = await supabase
        .from('business_listings')
        .select(`
          *,
          profiles!business_listings_user_id_fkey (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Businesses query result:', { businesses, businessError });

      if (businessError) {
        console.error('Business error:', businessError);
        setPendingBusinesses([]);
      } else {
        setPendingBusinesses(businesses || []);
      }

      // Fetch pending restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurant_listings')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Restaurants query result:', { restaurants, restaurantError });

      if (restaurantError) {
        console.error('Restaurant error:', restaurantError);
        setPendingRestaurants([]);
      } else if (restaurants) {
        const restaurantsWithProfiles = await Promise.all(
          restaurants.map(async (restaurant) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', restaurant.user_id)
              .single();

            return {
              ...restaurant,
              hours: typeof restaurant.hours === 'object' && restaurant.hours !== null ? 
                restaurant.hours as Record<string, string> : {},
              gallery_images: Array.isArray(restaurant.gallery_images) ? 
                restaurant.gallery_images as string[] : [],
              menu_images: Array.isArray(restaurant.menu_images) ? 
                restaurant.menu_images as string[] : [],
              profiles: profile
            };
          })
        );
        
        setPendingRestaurants(restaurantsWithProfiles);
      } else {
        setPendingRestaurants([]);
      }

      // Fetch pending hotels
      console.log('Fetching pending hotels...');
      const { data: hotels, error: hotelError } = await supabase
        .from('hotel_listings')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Hotels query result:', { hotels, hotelError });

      if (hotelError) {
        console.error('Hotel error:', hotelError);
        setPendingHotels([]);
      } else {
        const hotelArray = hotels || [];
        console.log(`Processing ${hotelArray.length} pending hotels`);
        
        if (hotelArray.length > 0) {
          // Manually fetch profiles for each hotel
          const hotelsWithProfiles = await Promise.all(
            hotelArray.map(async (hotel) => {
              console.log(`Fetching profile for hotel ${hotel.id} with user_id ${hotel.user_id}`);
              
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('name, email')
                .eq('id', hotel.user_id)
                .single();

              if (profileError) {
                console.warn(`Failed to fetch profile for hotel ${hotel.id}:`, profileError);
              }

              return {
                ...hotel,
                gallery_images: Array.isArray(hotel.gallery_images) ? 
                  hotel.gallery_images as string[] : [],
                amenities: Array.isArray(hotel.amenities) ? 
                  hotel.amenities as string[] : [],
                policies: typeof hotel.policies === 'object' && hotel.policies !== null ? 
                  hotel.policies as Record<string, any> : {},
                profiles: profile || null
              };
            })
          );
          
          console.log('Final hotels with profiles:', hotelsWithProfiles);
          setPendingHotels(hotelsWithProfiles);
        } else {
          console.log('No pending hotels found');
          setPendingHotels([]);
        }
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setPendingEvents([]);
      setPendingBusinesses([]);
      setPendingRestaurants([]);
      setPendingHotels([]);
    }
  };

  return {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    fetchPendingItems,
  };
};
