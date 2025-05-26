
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, MapPin, Phone, Globe } from 'lucide-react';
import { restaurantData, Restaurant } from '../data/restaurants';

const RestaurantDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (slug && restaurantData[slug]) {
      setRestaurant(restaurantData[slug]);
      
      // Check if restaurant is currently open
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const todayHours = restaurantData[slug].hours[currentDay];
      if (todayHours && todayHours !== 'Closed') {
        const [openTime, closeTime] = todayHours.split(' - ');
        const openTime24 = convertTo24Hour(openTime);
        const closeTime24 = convertTo24Hour(closeTime);
        
        if (currentTime >= openTime24 && currentTime <= closeTime24) {
          setIsOpen(true);
        }
      }
    }
  }, [slug]);

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}`;
  };

  const handleWhatsAppClick = () => {
    if (restaurant?.whatsapp) {
      const message = encodeURIComponent(`Hi! I'd like to make a reservation at ${restaurant.name}.`);
      window.open(`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

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
                <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
                <div className="space-y-2">
                  {Object.entries(restaurant.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image Gallery */}
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
            </div>
          </TabsContent>
          
          <TabsContent value="menu" className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Menu</h3>
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
