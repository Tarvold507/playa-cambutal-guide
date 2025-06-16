
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, Star, Clock } from 'lucide-react';
import { RestaurantListing } from '@/hooks/useRestaurantListings';

interface EatRestaurantGridProps {
  filteredRestaurants: RestaurantListing[];
}

const EatRestaurantGrid = ({ filteredRestaurants }: EatRestaurantGridProps) => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Restaurants</h2>
          <p className="text-gray-600">From local favorites to international cuisine, find the perfect spot for your next meal.</p>
        </div>
        
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

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EatRestaurantGrid;
