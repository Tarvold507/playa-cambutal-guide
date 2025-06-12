
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CMSHero from '../components/CMSHero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';
import RestaurantFilter from '../components/RestaurantFilter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateSlug } from '../utils/slugUtils';
import { isRestaurantOpen } from '../utils/timeUtils';

interface RestaurantItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category?: string;
  openNow?: boolean;
  hours?: Record<string, string>;
  latitude?: number;
  longitude?: number;
}

const Eat = () => {
  const [allItems, setAllItems] = useState<RestaurantItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Helper function to normalize hours keys from lowercase to capitalized
  const normalizeHoursKeys = (hours: Record<string, string>): Record<string, string> => {
    const normalizedHours: Record<string, string> = {};
    
    Object.entries(hours).forEach(([key, value]) => {
      // Capitalize the first letter of the day name
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      normalizedHours[capitalizedKey] = value;
    });
    
    return normalizedHours;
  };

  const fetchApprovedRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_listings')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database restaurants to match our RestaurantItem interface
      const dbRestaurants: RestaurantItem[] = data?.map(restaurant => {
        const rawHours = typeof restaurant.hours === 'object' && restaurant.hours !== null ? 
          restaurant.hours as Record<string, string> : {};
        
        // Normalize the hours keys to be capitalized for consistency
        const normalizedHours = normalizeHoursKeys(rawHours);
        
        return {
          id: restaurant.id,
          title: restaurant.name,
          description: restaurant.description || 'Delicious food awaits you at this local restaurant.',
          imageSrc: restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          link: `/eat/${generateSlug(restaurant.name)}`,
          category: restaurant.category,
          openNow: isRestaurantOpen(normalizedHours),
          hours: normalizedHours,
          latitude: (restaurant as any).latitude ? Number((restaurant as any).latitude) : undefined,
          longitude: (restaurant as any).longitude ? Number((restaurant as any).longitude) : undefined
        };
      }) || [];

      setAllItems(dbRestaurants);
      setFilteredItems(dbRestaurants);
    } catch (error) {
      console.error('Error fetching approved restaurants:', error);
      toast({
        title: "Error",
        description: "Failed to load restaurants",
        variant: "destructive",
      });
      setAllItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApprovedRestaurants();
  }, []);

  const handleFilterChange = (showOpenOnly: boolean) => {
    if (showOpenOnly) {
      setFilteredItems(allItems.filter(item => item.openNow));
    } else {
      setFilteredItems(allItems);
    }
  };

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
      
      {/* Hero Section */}
      <CMSHero 
        pagePath="/eat"
        fallbackTitle="Eat & Drink"
        fallbackSubtitle="Discover the best culinary experiences in Playa Cambutal"
        fallbackImageSrc="https://images.unsplash.com/photo-1579631542761-3f43399f7fe8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Culinary Delights in Paradise</h2>
          <p className="text-gray-600 mb-4">
            Playa Cambutal may be small, but its food scene is surprisingly diverse and delicious. From 
            beachfront seafood shacks to upscale international cuisine, there's something to satisfy every palate.
          </p>
          <p className="text-gray-600">
            Many restaurants emphasize locally-sourced ingredients, including fresh seafood caught daily, 
            tropical fruits, and vegetables from nearby farms. Don't miss the opportunity to try local Panamanian dishes 
            alongside international favorites.
          </p>
        </div>
      </section>

      {/* Restaurant Filter */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <RestaurantFilter onFilterChange={handleFilterChange} />
        </div>
      </section>
      
      {/* Restaurant Listings */}
      <CardSection 
        title="Where to Eat"
        description="From casual beachfront dining to upscale restaurants, explore Playa Cambutal's food scene."
        items={filteredItems}
        bgColor="bg-gray-50"
      />
      
      {/* Food Tips Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dining Tips</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Reservation Recommendations</h3>
                <p className="text-gray-600">During high season (December-April), we recommend making reservations at popular restaurants, especially for dinner. Most places accept reservations by phone or WhatsApp.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Local Specialties</h3>
                <p className="text-gray-600">Be sure to try local specialties like ceviche, patacones (fried plantains), sancocho (chicken soup), and fresh tropical fruit juices.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Dietary Restrictions</h3>
                <p className="text-gray-600">Most restaurants can accommodate vegetarian diets, and many now offer vegan options as well. For those with specific food allergies, it's best to call ahead.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Restaurant Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Own a Restaurant in Cambutal?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our directory and reach more customers! Add your restaurant to our platform and showcase your 
            delicious offerings to locals and tourists alike.
          </p>
          <Button 
            onClick={() => navigate('/add-restaurant')}
            size="lg"
            className="bg-venao-dark hover:bg-venao-dark/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your Restaurant Here
          </Button>
          {!user && (
            <p className="text-sm text-gray-500 mt-2">
              You'll need to sign in to add a restaurant listing.
            </p>
          )}
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Eat;
