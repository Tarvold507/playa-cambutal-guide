
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { RestaurantListing } from '@/hooks/useRestaurantListings';
import { updatePageHead } from '@/utils/seoUtils';
import EatHero from '../components/eat/EatHero';
import EatIntro from '../components/eat/EatIntro';
import EatSearchFilter from '../components/eat/EatSearchFilter';
import EatRestaurantGrid from '../components/eat/EatRestaurantGrid';
import EatTips from '../components/eat/EatTips';
import EatAddRestaurant from '../components/eat/EatAddRestaurant';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set SEO for the Eat page
    updatePageHead({
      id: 'eat-page',
      page_path: '/eat',
      page_title: 'Restaurants & Dining in Playa Cambutal - Playa Cambutal Guide',
      meta_description: 'Discover the best restaurants and dining options in Playa Cambutal, Panama. From local favorites to international cuisine, find the perfect spot for your next meal.',
      meta_keywords: 'Playa Cambutal restaurants, Panama dining, beach restaurants, local food, seafood, international cuisine',
      og_title: 'Restaurants & Dining in Playa Cambutal',
      og_description: 'Discover amazing dining experiences in Playa Cambutal, from fresh seafood to international cuisine.',
      og_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${window.location.origin}/eat`,
      robots: 'index, follow',
      schema_markup: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Restaurants & Dining in Playa Cambutal",
        "description": "Discover the best restaurants and dining options in Playa Cambutal, Panama. From local favorites to international cuisine, find the perfect spot for your next meal.",
        "url": `${window.location.origin}/eat`
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
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

  // Filter restaurants based on search and category
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(restaurants.map(restaurant => restaurant.category))];

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
      <Navbar />
      <EatHero />
      <EatIntro />
      <EatSearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
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
