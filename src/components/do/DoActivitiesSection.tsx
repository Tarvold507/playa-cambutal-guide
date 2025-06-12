
import { Link } from 'react-router-dom';
import BusinessFilter from '../BusinessFilter';

interface BusinessCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category?: string;
}

interface DoActivitiesSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filteredItems: BusinessCard[];
  isLoading: boolean;
}

const DoActivitiesSection = ({ 
  selectedCategory, 
  onCategoryChange, 
  filteredItems, 
  isLoading 
}: DoActivitiesSectionProps) => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Activities & Adventures</h2>
          <p className="text-gray-600 mb-8">
            Discover the diverse range of experiences available in and around Playa Cambutal.
          </p>
        </div>
        
        <BusinessFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading activities...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <Link 
                key={item.id} 
                to={item.link}
                className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.imageSrc} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-venao-dark/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </div>
                  )}
                </div>
                <div className="p-5 bg-white">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-venao transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No activities found for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoActivitiesSection;
