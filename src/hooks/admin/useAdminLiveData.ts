import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminLiveData = () => {
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [liveBusinesses, setLiveBusinesses] = useState<any[]>([]);
  const [liveRestaurants, setLiveRestaurants] = useState<any[]>([]);
  const [liveHotels, setLiveHotels] = useState<any[]>([]);
  const [liveAdventureBusinesses, setLiveAdventureBusinesses] = useState<any[]>([]);

  const fetchLiveItems = async () => {
    try {
      console.log('Fetching live items...');
      
      // Fetch approved events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_user_id_fkey (name, email)
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (eventsError) {
        console.error('Events error:', eventsError);
        setLiveEvents([]);
      } else {
        setLiveEvents(events || []);
      }

      // Fetch approved businesses
      const { data: businesses, error: businessError } = await supabase
        .from('business_listings')
        .select(`
          *,
          profiles!business_listings_user_id_fkey (name, email)
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (businessError) {
        console.error('Business error:', businessError);
        setLiveBusinesses([]);
      } else {
        setLiveBusinesses(businesses || []);
      }

      // Fetch approved restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurant_listings')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (restaurantError) {
        console.error('Restaurant error:', restaurantError);
        setLiveRestaurants([]);
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
              closed_for_season: restaurant.closed_for_season || false,
              profiles: profile
            };
          })
        );
        
        setLiveRestaurants(restaurantsWithProfiles);
      } else {
        setLiveRestaurants([]);
      }

      // Fetch approved hotels
      const { data: hotels, error: hotelError } = await supabase
        .from('hotel_listings')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (hotelError) {
        console.error('Hotel error:', hotelError);
        setLiveHotels([]);
      } else {
        const hotelArray = hotels || [];
        
        if (hotelArray.length > 0) {
          const hotelsWithProfiles = await Promise.all(
            hotelArray.map(async (hotel) => {
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
          
          setLiveHotels(hotelsWithProfiles);
        } else {
          setLiveHotels([]);
        }
      }

      // Fetch approved adventure businesses
      const { data: adventureBusinesses, error: adventureError } = await supabase
        .from('adventure_business_listings')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (adventureError) {
        console.error('Adventure business error:', adventureError);
        setLiveAdventureBusinesses([]);
      } else {
        const adventureArray = adventureBusinesses || [];
        
        if (adventureArray.length > 0) {
          const adventureBusinessesWithProfiles = await Promise.all(
            adventureArray.map(async (business) => {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('name, email')
                .eq('id', business.user_id)
                .single();

              if (profileError) {
                console.warn(`Failed to fetch profile for adventure business ${business.id}:`, profileError);
              }

              return {
                ...business,
                profiles: profile || null
              };
            })
          );
          
          setLiveAdventureBusinesses(adventureBusinessesWithProfiles);
        } else {
          setLiveAdventureBusinesses([]);
        }
      }
    } catch (error) {
      console.error('Error fetching live items:', error);
      setLiveEvents([]);
      setLiveBusinesses([]);
      setLiveRestaurants([]);
      setLiveHotels([]);
      setLiveAdventureBusinesses([]);
    }
  };

  return {
    liveEvents,
    liveBusinesses,
    liveRestaurants,
    liveHotels,
    liveAdventureBusinesses,
    fetchLiveItems,
  };
};
