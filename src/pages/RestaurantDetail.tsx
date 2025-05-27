
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, MapPin, Phone, Globe } from 'lucide-react';
import { restaurantData, Restaurant } from '../data/restaurants';
import { findRestaurantBySlug } from '../utils/slugUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isRestaurantOpen, formatHoursForDisplay } from '../utils/timeUtils';

const RestaurantDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to normalize hours keys from lowercase to capitalized
  const normalizeHoursKeys = (hours: Record<string, string>): Record<string, string> => {
    const normalizedHours: Record<string, string> = {};
    
    Object.entries(hours).forEach(([key, value]) => {
      // Capitalize the first letter of the day name
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      normalizedHours[capitalizedKey] = value;
    });
    
    console.log('Original hours:', hours);
    console.log('Normalized hours:', normalizedHours);
    
    return normalizedHours;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchRestaurant = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      // First check static restaurant data
      const staticRestaurant = findRestaurantBySlug(slug, restaurantData);
      if (staticRestaurant) {
        console.log('Found static restaurant:', staticRestaurant.name);
        console.log('Static restaurant hours:', staticRestaurant.hours);
        setRestaurant(staticRestaurant);
        setIsOpen(isRestaurantOpen(staticRestaurant.hours));
        setLoading(false);
        return;
      }

      // If not found in static data, check database restaurants
      try {
        const { data, error } = await supabase
          .from('restaurant_listings')
          .select('*')
          .eq('approved', true);

        if (error) throw error;

        // Find restaurant by slug in database results
        const dbRestaurant = data?.find(r => {
          const generatedSlug = r.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .replace(/-+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
          return generatedSlug === slug;
        });

        if (dbRestaurant) {
          console.log('Found database restaurant:', dbRestaurant.name);
          console.log('Raw database hours:', dbRestaurant.hours);
          
          // Transform database restaurant to match Restaurant interface
          const rawHours = typeof dbRestaurant.hours === 'object' && dbRestaurant.hours !== null ? 
            dbRestaurant.hours as Record<string, string> : {};
          
          // Normalize the hours keys to be capitalized
          const normalizedHours = normalizeHoursKeys(rawHours);
          
          const transformedRestaurant: Restaurant = {
            name: dbRestaurant.name,
            category: dbRestaurant.category,
            imageSrc: dbRestaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: dbRestaurant.description || 'A wonderful restaurant in Cambutal.',
            address: dbRestaurant.address,
            phone: dbRestaurant.phone,
            website: dbRestaurant.website,
            whatsapp: dbRestaurant.whatsapp,
            hours: normalizedHours,
            images: Array.isArray(dbRestaurant.gallery_images) ? 
              dbRestaurant.gallery_images as string[] : [],
            menuImages: Array.isArray(dbRestaurant.menu_images) ? 
              dbRestaurant.menu_images as string[] : []
          };
          
          console.log('Transformed restaurant hours:', transformedRestaurant.hours);
          
          setRestaurant(transformedRestaurant);
          setIsOpen(isRestaurantOpen(normalizedHours));
          
          console.log('Restaurant open status:', isRestaurantOpen(normalizedHours));
        } else {
          console.log('Restaurant not found for slug:', slug);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Error",
          description: "Failed to load restaurant details",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };

    fetchRestaurant();
  }, [slug, toast]);

  const handleWhatsAppClick = () => {
    if (restaurant?.whatsapp) {
      const message = encodeURIComponent(`Hi! I'd like to make a reservation at ${restaurant.name}.`);
      window.open(`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading restaurant...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={restaurant.imageSrc} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="text-white">
              <span className="inline-block bg-venao-dark/90 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                {restaurant.category}
              </span>
              <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                {restaurant.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Button onClick={handleWhatsAppClick} className="bg-green-500 hover:bg-green-600">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            {restaurant.phone && (
              <Button variant="outline" onClick={() => window.open(`tel:${restaurant.phone}`)}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
            {restaurant.website && (
              <Button variant="outline" onClick={() => window.open(restaurant.website, '_blank')}>
                <Globe className="w-4 h-4 mr-2" />
                Website
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p className="text-gray-600 mb-6">{restaurant.description}</p>
                
                {/* Hours */}
                {Object.keys(restaurant.hours).length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
                    <div className="space-y-2">
                      {formatHoursForDisplay(restaurant.hours).map(({ day, hours }) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Image Gallery */}
              {restaurant.images && restaurant.images.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {restaurant.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${restaurant.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="menu" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Menu</h3>
            {restaurant.menuImages && restaurant.menuImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.menuImages.map((image, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Menu ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Menu images coming soon...</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            <div className="text-center py-8 text-gray-500">
              <p>Google Reviews integration coming soon...</p>
              <p className="text-sm mt-2">This will display real Google Reviews for {restaurant.name}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default RestaurantDetail;
