
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Utensils, Pizza, Coffee, Wine, Fish, Salad } from 'lucide-react';
import { RestaurantListing } from '@/hooks/useRestaurantListings';
import { generateSlug } from '@/utils/slugUtils';

interface EatRestaurantGridProps {
  filteredRestaurants: RestaurantListing[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'italian':
    case 'pizza':
      return Pizza;
    case 'cafe':
    case 'coffee':
      return Coffee;
    case 'bar & tapas':
    case 'bar':
      return Wine;
    case 'seafood':
      return Fish;
    case 'healthy':
    case 'vegetarian':
      return Salad;
    default:
      return Utensils;
  }
};

const EatRestaurantGrid = ({ filteredRestaurants }: EatRestaurantGridProps) => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Restaurants</h2>
          <p className="text-gray-600">From local favorites to international cuisine, find the perfect spot for your next meal.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => {
            const CategoryIcon = getCategoryIcon(restaurant.category);
            const slug = restaurant.slug || generateSlug(restaurant.name);
            
            return (
              <Link 
                key={restaurant.id} 
                to={`/eat/${slug}`}
                className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-venao-dark/90 text-white p-2 rounded-full">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  {restaurant.is_premium && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-5 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-venao transition-colors duration-300">
                      {restaurant.name}
                    </h3>
                    <Badge variant="outline">{restaurant.category}</Badge>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{restaurant.description}</p>
                </div>
              </Link>
            );
          })}
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
