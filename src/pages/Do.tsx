import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';

const doItems = [
  {
    id: '1',
    title: 'Yoga Classes',
    description: 'Find your zen with beachfront yoga classes offering stunning views and rejuvenating practice.',
    imageSrc: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do/yoga',
    category: 'Wellness'
  },
  {
    id: '2',
    title: 'Wildlife Tours',
    description: 'Explore the rich biodiversity of Panama with guided tours to see monkeys, birds, and other wildlife.',
    imageSrc: '/lovable-uploads/ae1b8699-6773-40f6-83b9-634042a4d035.png',
    link: '/do/wildlife-tours',
    category: 'Nature'
  },
  {
    id: '3',
    title: 'Horseback Riding',
    description: 'Ride horses along the beach and through scenic landscapes with experienced guides.',
    imageSrc: 'https://images.unsplash.com/photo-1503197480077-5b96f7cbf866?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do/horseback-riding',
    category: 'Activity'
  },
  {
    id: '4',
    title: 'Snorkeling & Diving',
    description: 'Discover the underwater world with snorkeling and diving trips to nearby reefs and islands.',
    imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do/snorkeling-diving',
    category: 'Water'
  },
  {
    id: '5',
    title: 'Waterfall Hikes',
    description: 'Hike to stunning waterfalls in the nearby mountains, with refreshing pools for swimming.',
    imageSrc: 'https://images.unsplash.com/photo-1563106628-2ecfa840037d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do/waterfall-hikes',
    category: 'Adventure'
  },
  {
    id: '6',
    title: 'Fishing Trips',
    description: 'Join local fishermen or charter a boat for a day of fishing in the productive waters of the Pacific.',
    imageSrc: 'https://images.unsplash.com/photo-1516741247836-f66a30241b0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do/fishing',
    category: 'Water'
  }
];

const Do = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Things To Do"
        subtitle="Explore activities and adventures in and around Playa Cambutal"
        imageSrc="https://images.unsplash.com/photo-1605538032404-d7f635269120?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Beyond the Beach</h2>
          <p className="text-gray-600 mb-4">
            While Playa Cambutal is famous for its surf, there's so much more to experience in this diverse region. 
            From yoga and wellness to adventure activities and wildlife encounters, you'll find plenty to fill 
            your days when you're not catching waves.
          </p>
          <p className="text-gray-600">
            The area surrounding Playa Cambutal offers pristine jungles, mountains, and nearby islands to explore, 
            providing a perfect mix of relaxation and adventure for travelers of all interests.
          </p>
        </div>
      </section>
      
      {/* Activities Listings */}
      <CardSection 
        title="Activities & Adventures"
        description="Discover the diverse range of experiences available in and around Playa Cambutal."
        items={doItems}
        bgColor="bg-gray-50"
      />
      
      {/* Special Experiences */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Special Experiences</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Turtle Conservation</h3>
                <p className="text-gray-600">During certain times of the year, you can participate in turtle conservation efforts. Join guided night walks to spot nesting turtles or help release baby turtles into the ocean during hatching season.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Local Festivals</h3>
                <p className="text-gray-600">Check the local calendar for festivals and events that showcase Panamanian culture, music, and food. The region hosts several celebrations throughout the year that provide authentic cultural experiences.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Island Hopping</h3>
                <p className="text-gray-600">Take a day trip to explore nearby islands like Isla Iguana, a wildlife refuge with pristine beaches and snorkeling opportunities. Boat tours typically include transportation, snorkeling equipment, and lunch.</p>
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

export default Do;
