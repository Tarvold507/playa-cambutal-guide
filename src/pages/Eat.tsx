
import { useState, useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { RestaurantListing } from '@/hooks/useRestaurantListings';
import RestaurantFilter from '@/components/RestaurantFilter';
import RestaurantMap from '@/components/RestaurantMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const { fetchSEOByPath } = usePageSEO();
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<RestaurantListing[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  useEffect(() => {
    const loadSEO = async () => {
      const seoData = await fetchSEOByPath('eat');
      if (seoData) {
        document.title = seoData.page_title || 'Eat - Playa Cambutal Guide';
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', seoData.meta_description || 'Discover the best restaurants and dining options in Playa Cambutal');
        }
        
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', seoData.meta_keywords || 'restaurants, dining, Playa Cambutal, food, Panama');
        }
      }
    };
    
    loadSEO();
  }, [fetchSEOByPath]);

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
        setFilteredRestaurants(finalRestaurants);
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

  const handleFilterChange = (showOpen: boolean) => {
    setShowOpenOnly(showOpen);
    // Note: This is a simplified filter - you might want to implement actual "open now" logic
    // For now, we'll just show all restaurants regardless of the filter
    setFilteredRestaurants(restaurants);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-xl">Loading restaurants...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Eat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing dining experiences in Playa Cambutal. From local favorites to international cuisine, find the perfect spot for your next meal.
          </p>
        </div>

        <RestaurantFilter onFilterChange={handleFilterChange} />

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className={`hover:shadow-lg transition-shadow ${restaurant.is_premium ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
                  <div className="md:flex">
                    {restaurant.image_url && (
                      <div className="md:w-1/3">
                        <img
                          src={restaurant.image_url}
                          alt={restaurant.name}
                          className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                      </div>
                    )}
                    <div className={`${restaurant.image_url ? 'md:w-2/3' : 'w-full'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              {restaurant.name}
                              {restaurant.is_premium && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center text-gray-600 mt-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              {restaurant.address}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{restaurant.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{restaurant.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          {restaurant.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {restaurant.phone}
                            </div>
                          )}
                          {restaurant.website && (
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Website
                              </a>
                            </div>
                          )}
                        </div>

                        {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Clock className="w-4 h-4 mr-1" />
                              Hours
                            </div>
                            <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                              {Object.entries(restaurant.hours).map(([day, hours]) => (
                                <div key={day} className="flex justify-between">
                                  <span className="capitalize">{day}:</span>
                                  <span>{hours}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button asChild>
                          <Link to={`/restaurant/${restaurant.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {filteredRestaurants.length > 0 && (
                <RestaurantMap 
                  latitude={null} 
                  longitude={null} 
                  name="Restaurants in Playa Cambutal" 
                  address="Playa Cambutal, Panama" 
                />
              )}
            </div>
          </div>
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No restaurants found matching your criteria.
            </p>
            <Button 
              onClick={() => {
                setShowOpenOnly(false);
                setFilteredRestaurants(restaurants);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Eat;
