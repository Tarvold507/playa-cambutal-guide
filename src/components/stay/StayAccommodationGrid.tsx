
import { Link } from 'react-router-dom';

interface StayItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category: string;
  price?: number | null;
  rating?: number | null;
}

interface StayAccommodationGridProps {
  filteredItems: StayItem[];
}

const StayAccommodationGrid = ({ filteredItems }: StayAccommodationGridProps) => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Accommodations</h2>
          <p className="text-gray-600">From luxury resorts to budget-friendly hostels, find your perfect place to stay.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <Link key={item.id} to={item.link} className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.imageSrc} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-venao-dark/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {item.category}
                </div>
                {item.price && (
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    From ${item.price}/night
                  </div>
                )}
              </div>
              <div className="p-5 bg-white">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-venao transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">{item.description}</p>
                {item.rating && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{item.rating}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No accommodations found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StayAccommodationGrid;
