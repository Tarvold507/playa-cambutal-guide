
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Featured from '../components/Featured';
import Newsletter from '../components/Newsletter';
import AdventureBusinessSubmissionForm from '../components/AdventureBusinessSubmissionForm';
import BusinessFilter from '../components/BusinessFilter';
import { useAdventureBusinessListings } from '@/hooks/useAdventureBusinessListings';

const Do = () => {
  const { businesses, isLoading, error } = useAdventureBusinessListings();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Things to Do in Cambutal, Panama - Activities & Tours",
      "description": "Discover exciting activities in Playa Cambutal, Panama. From surfing and yoga to wildlife tours and fishing charters.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "TouristDestination",
        "name": "Cambutal Activities",
        "description": "Activities and tours in Playa Cambutal, Panama",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 7.2833,
          "longitude": -80.5167
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "Panama",
          "addressRegion": "Los Santos Province",
          "addressLocality": "Cambutal"
        }
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.textContent === JSON.stringify(structuredData)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Convert adventure businesses to card format
  const businessCards = businesses.map(business => ({
    id: business.id,
    title: business.business_name,
    description: business.description,
    imageSrc: business.image_url || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: `/do/${business.category}`,
    category: business.business_type
  }));

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? businessCards 
    : businessCards.filter(item => {
        // Map categories for filtering
        const categoryMap: { [key: string]: string[] } = {
          'surf': ['Surf'],
          'fitness': ['Wellness', 'Yoga Classes', 'Personal Training', 'Group Fitness', 'Wellness Retreats'],
          'tours': ['Nature', 'Wildlife Tours', 'Hiking Tours', 'Cultural Tours', 'Photography Tours'],
          'fishing': ['Water', 'Fishing Charters', 'Fishing Guides', 'Equipment Rental', 'Fishing Tours']
        };
        
        const allowedCategories = categoryMap[selectedCategory] || [];
        return allowedCategories.includes(item.category || '');
      });

  if (error) {
    console.error('Error loading adventure businesses:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero 
        title="Things to Do in Cambutal, Panama"
        subtitle="Discover activities, adventures, and experiences in Panama's beach paradise"
        imageSrc="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Experience Cambutal, Panama</h1>
          <p className="text-gray-600 mb-4">
            From world-class surfing to breathtaking nature experiences, Playa Cambutal offers endless 
            opportunities for adventure in Panama. Whether you're seeking the perfect wave, wanting to explore 
            Panama's pristine jungles, or looking to connect with nature through yoga on the beach, 
            you'll find your perfect adventure in this Pacific coast paradise.
          </p>
        </div>
      </section>
      
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
            onCategoryChange={setSelectedCategory}
          />
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading activities...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <div key={item.id} className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No activities found for this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Business</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Are you offering fun activities in Cambutal? Join our directory and connect with 
            visitors looking for authentic local experiences. Whether you offer surf lessons, 
            nature tours, fishing charters, art or fitness classes, showcase your business to our community.
          </p>
          <AdventureBusinessSubmissionForm />
        </div>
      </section>
      
      <Featured 
        title="Surf Paradise"
        description="Playa Cambutal offers consistent waves throughout the year, making it an ideal destination for surfers of all levels. With a variety of breaks and waves ranging from gentle rollers to powerful point breaks, there's something for everyone. Local surf schools provide lessons and equipment rentals for beginners, while experienced surfers can find challenging waves during peak seasons."
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Cambutal"
        link="/do/surf"
        linkText="Learn more about surfing"
        imageOnRight={true}
      />
      
      <Featured 
        title="Nature & Wildlife"
        description="Immerse yourself in Panama's incredible biodiversity. Take guided tours to spot monkeys, exotic birds, and marine life. Hike through pristine rainforests, discover hidden waterfalls, or join conservation efforts to protect local wildlife. Our experienced guides ensure unforgettable encounters with nature."
        imageSrc="https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Wildlife viewing in Panama"
        link="/do/wildlife"
        linkText="Explore nature activities"
        imageOnRight={false}
      />
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Do;
