
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { RestaurantListing } from '@/hooks/useRestaurantListings';
import { isRestaurantOpen } from '@/utils/timeUtils';
import EatHero from '../components/eat/EatHero';
import EatIntro from '../components/eat/EatIntro';
import EatSearchFilter from '../components/eat/EatSearchFilter';
import EatRestaurantGrid from '../components/eat/EatRestaurantGrid';
import EatTips from '../components/eat/EatTips';
import EatAddRestaurant from '../components/eat/EatAddRestaurant';
import EatSEO from '../components/eat/EatSEO';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Helper function to randomize array order
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Eat = () => {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<RestaurantListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurant_listings')
          .select('*')
          .eq('approved', true);

        if (error) throw error;

        const transformedRestaurants: RestaurantListing[] = data?.map(restaurant => ({
          ...restaurant,
          hours: typeof restaurant.hours === 'object' && restaurant.hours !== null ? 
            restaurant.hours as Record<string, string> : {},
          gallery_images: Array.isArray(restaurant.gallery_images) ? 
            restaurant.gallery_images as string[] : [],
          menu_images: Array.isArray(restaurant.menu_images) ? 
            restaurant.menu_images as string[] : [],
          is_premium: restaurant.is_premium || false,
          display_order: restaurant.display_order || 0,
          closed_for_season: restaurant.closed_for_season || false,
        })) || [];

        // Sort restaurants: premium first (by display_order, then randomized), then regular (randomized)
        const premiumRestaurants = transformedRestaurants.filter(restaurant => restaurant.is_premium);
        const regularRestaurants = transformedRestaurants.filter(restaurant => !restaurant.is_premium);

        // Sort premium restaurants by display_order, then randomize within same order
        const sortedPremiumRestaurants = premiumRestaurants
          .sort((a, b) => a.display_order - b.display_order)
          .reduce((acc, restaurant) => {
            const sameOrderRestaurants = premiumRestaurants.filter(r => r.display_order === restaurant.display_order);
            if (!acc.some(r => r.id === restaurant.id)) {
              acc.push(...shuffleArray(sameOrderRestaurants));
            }
            return acc;
          }, [] as RestaurantListing[]);

        // Randomize regular restaurants
        const shuffledRegularRestaurants = shuffleArray(regularRestaurants);

        // Combine: premium first, then regular
        const finalRestaurants = [...sortedPremiumRestaurants, ...shuffledRegularRestaurants];

        setRestaurants(finalRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          title: "Error",
          description: "Failed to load restaurant listings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [toast]);

  // Filter restaurants based on open/closed status
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!showOpenOnly) return true;
    
    // Skip filtering if restaurant is closed for season
    if (restaurant.closed_for_season) return false;
    
    // Check if restaurant is currently open
    return isRestaurantOpen(restaurant.hours);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading restaurants...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <EatSEO />
      <Navbar />
      <EatHero />
      <EatIntro />
      <EatSearchFilter 
        showOpenOnly={showOpenOnly}
        setShowOpenOnly={setShowOpenOnly}
      />
      <EatRestaurantGrid filteredRestaurants={filteredRestaurants} />
      <EatTips />
      <EatAddRestaurant />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Eat;
