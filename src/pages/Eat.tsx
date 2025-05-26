
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';
import RestaurantFilter from '../components/RestaurantFilter';

const eatItems = [
  {
    id: '1',
    title: 'Beachfront Grill',
    description: 'Enjoy fresh seafood and grilled specialties with your toes in the sand at this casual beachfront eatery.',
    imageSrc: 'https://images.unsplash.com/photo-1619738566066-81c4559aba52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat/beachfront-grill',
    category: 'Seafood',
    openNow: true,
    hours: '11:00 AM - 10:00 PM'
  },
  {
    id: '2',
    title: 'Jungle Cafe',
    description: 'A cozy spot offering organic breakfasts, smoothie bowls, and gourmet coffee in a lush garden setting.',
    imageSrc: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat/jungle-cafe',
    category: 'Cafe',
    openNow: true,
    hours: '7:00 AM - 3:00 PM'
  },
  {
    id: '3',
    title: 'Sunset Lounge',
    description: 'The perfect spot to enjoy craft cocktails and tapas while watching Cambutal\'s famous sunsets.',
    imageSrc: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat/sunset-lounge',
    category: 'Bar & Tapas',
    openNow: false,
    hours: '5:00 PM - 12:00 AM'
  },
  {
    id: '4',
    title: 'Pizzeria Cambutal',
    description: 'Wood-fired pizzas with creative toppings, made with local and imported ingredients.',
    imageSrc: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat/pizzeria',
    category: 'Italian',
    openNow: true,
    hours: '12:00 PM - 11:00 PM'
  },
  {
    id: '5',
    title: 'Sushi Paradise',
    description: 'Fresh sushi and Japanese-inspired dishes using locally caught fish and imported specialties.',
    imageSrc: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat/sushi',
    category: 'Japanese',
    openNow: false,
    hours: '6:00 PM - 11:00 PM'
  },
  {
    id: '6',
    title: 'Local Comedor',
    description: 'Experience authentic Panamanian home cooking at this family-run restaurant offering daily specials.',
    imageSrc: 'https://images.unsplash.com/photo-1628519592419-bf1b8fb630cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat/comedor',
    category: 'Panamanian',
    openNow: true,
    hours: '11:00 AM - 9:00 PM'
  }
];

const Eat = () => {
  const [filteredItems, setFilteredItems] = useState(eatItems);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = (showOpenOnly: boolean) => {
    if (showOpenOnly) {
      setFilteredItems(eatItems.filter(item => item.openNow));
    } else {
      setFilteredItems(eatItems);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Eat & Drink"
        subtitle="Discover the best culinary experiences in Playa Cambutal"
        imageSrc="https://images.unsplash.com/photo-1579631542761-3f43399f7fe8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
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
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Eat;
