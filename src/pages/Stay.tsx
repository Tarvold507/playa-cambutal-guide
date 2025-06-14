import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHotelListings } from '@/hooks/useHotelListings';
import { updatePageHead } from '@/utils/seoUtils';
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

const Stay = () => {
  const { user } = useAuth();
  const { hotels, loading } = useHotelListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set SEO for the Stay page
    updatePageHead({
      id: 'stay-page',
      page_path: '/stay',
      page_title: 'Hotels & Accommodations in Playa Cambutal - Playa Cambutal Guide',
      meta_description: 'Find the perfect place to stay in Playa Cambutal, Panama. From luxury resorts to budget hostels, discover accommodations for every traveler.',
      meta_keywords: 'Playa Cambutal hotels, Panama accommodation, beach hotels, surf hotels, eco lodges, hostels, vacation rentals',
      og_title: 'Hotels & Accommodations in Playa Cambutal',
      og_description: 'Discover the best places to stay in Playa Cambutal, from luxury beachfront resorts to cozy eco-lodges.',
      og_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      canonical_url: `${window.location.origin}/stay`,
      robots: 'index, follow',
      schema_markup: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Hotels & Accommodations in Playa Cambutal",
        "description": "Find the perfect place to stay in Playa Cambutal, Panama. From luxury resorts to budget hostels, discover accommodations for every traveler.",
        "url": `${window.location.origin}/stay`
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Load Expedia widget script with proper initialization
    const loadExpediaWidget = () => {
      // Check if script already exists
      const existingScript = document.querySelector('.eg-widgets-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.className = 'eg-widgets-script';
      script.src = 'https://affiliates.expediagroup.com/products/widgets/assets/eg-widgets.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Expedia widget script loaded successfully');
        setWidgetLoaded(true);
        
        // Initialize widget after script loads
        setTimeout(() => {
          if (window.EGWidgets) {
            try {
              window.EGWidgets.init();
              console.log('Expedia widget initialized');
            } catch (error) {
              console.error('Error initializing Expedia widget:', error);
            }
          } else {
            console.warn('EGWidgets not available on window object');
          }
        }, 100);
      };
      
      script.onerror = () => {
        console.error('Failed to load Expedia widget script');
      };
      
      document.head.appendChild(script);
    };

    // Load the widget script
    loadExpediaWidget();

    // Cleanup script on unmount
    return () => {
      const existingScript = document.querySelector('.eg-widgets-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Re-initialize widget when it becomes visible
  useEffect(() => {
    if (widgetLoaded && window.EGWidgets) {
      const timer = setTimeout(() => {
        try {
          window.EGWidgets.init();
          console.log('Re-initialized Expedia widget');
        } catch (error) {
          console.error('Error re-initializing widget:', error);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [widgetLoaded]);

  // Transform dynamic hotels to StayItem format - now using the slug from the hook
  const dynamicItems: StayItem[] = hotels.map(hotel => ({
    id: hotel.id,
    title: hotel.name,
    description: hotel.description || 'Comfortable accommodation in Playa Cambutal.',
    imageSrc: hotel.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: `/stay/${hotel.slug}`,
    category: hotel.category,
    price: hotel.price_from,
    rating: hotel.rating
  }));

  // Filter items based on search and category
  const filteredItems = dynamicItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(dynamicItems.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading accommodations...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Places to Stay"
        subtitle="Find your perfect accommodation in Playa Cambutal"
        imageSrc="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Find Your Perfect Stay</h2>
          <p className="text-gray-600 mb-4">
            Playa Cambutal offers a wide range of accommodations to suit every budget and travel style. From luxury 
            resorts to eco-friendly hostels, you'll find the perfect place to call home during your stay.
          </p>
          <p className="text-gray-600">
            Most accommodations are located either right on the beach or within a short walking distance, allowing 
            you to easily enjoy all that Playa Cambutal has to offer.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search accommodations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-venao-dark focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-venao-dark focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Accommodation Listings */}
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
      
      {/* Enhanced Expedia Widget Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Your Stay</h2>
            <p className="text-gray-600">
              Compare prices and book accommodations in Playa Cambutal and surrounding areas.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              {!widgetLoaded && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venao-dark mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading booking widget...</p>
                </div>
              )}
              <div 
                id="expedia-search-widget"
                className="eg-widget" 
                data-widget="search" 
                data-program="us-expedia" 
                data-lobs="stays,flights" 
                data-network="pz" 
                data-camref="1100l5aKtR"
                data-theme="light"
                data-currency="USD"
                data-language="en"
                style={{ minHeight: widgetLoaded ? 'auto' : '400px' }}
              ></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Accommodation Tips Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Accommodation Tips</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Best Time to Book</h3>
                <p className="text-gray-600">We recommend booking your accommodation at least 3-4 months in advance for high season (December-April) and 1-2 months ahead for low season. Many places offer discounts for longer stays.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Location Considerations</h3>
                <p className="text-gray-600">The bay is horseshoe-shaped, with accommodations spread along its curve. The center offers easy access to most restaurants and services, while the ends provide more tranquility but may require transportation for getting around.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Amenities to Look For</h3>
                <p className="text-gray-600">Since Playa Cambutal can get quite hot, air conditioning or good fans are essential for comfort. Also consider if you need WiFi (quality varies), kitchen facilities, and whether the property has a generator (occasional power outages happen).</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add Hotel Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Own a Hotel in Cambutal?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our directory and reach more guests! Add your accommodation to our platform and showcase your 
            property to travelers from around the world.
          </p>
          <Button 
            onClick={() => window.location.href = user ? '/add-hotel' : '/auth'}
            size="lg"
            className="bg-venao-dark hover:bg-venao-dark/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your Property
          </Button>
          {!user && (
            <p className="text-sm text-gray-500 mt-2">
              You'll need to sign in to add a property listing.
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

// Add TypeScript declaration for the Expedia widget
declare global {
  interface Window {
    EGWidgets: {
      init: () => void;
    };
  }
}

export default Stay;
