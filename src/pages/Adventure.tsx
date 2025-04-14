
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Featured from '../components/Featured';
import Newsletter from '../components/Newsletter';

const adventureItems = [
  {
    id: '1',
    title: 'Surf Lessons',
    description: 'Learn to surf with professional instructors in the perfect learning environment of Playa Cambutal.',
    imageSrc: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/adventure/surf',
    category: 'Surf'
  },
  {
    id: '2',
    title: 'Yoga Classes',
    description: 'Find your zen with beachfront yoga classes offering stunning views and rejuvenating practice.',
    imageSrc: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/adventure/yoga',
    category: 'Wellness'
  },
  {
    id: '3',
    title: 'Wildlife Tours',
    description: 'Explore the rich biodiversity of Panama with guided tours to see monkeys, birds, and marine life.',
    imageSrc: 'https://images.unsplash.com/photo-1552083974-186346191183?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/adventure/wildlife',
    category: 'Nature'
  },
  {
    id: '4',
    title: 'Snorkeling & Diving',
    description: 'Discover the underwater world with snorkeling and diving trips to nearby reefs and islands.',
    imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/adventure/water',
    category: 'Water'
  },
  {
    id: '5',
    title: 'Hiking & Waterfalls',
    description: 'Explore stunning waterfalls and hiking trails in the nearby mountains.',
    imageSrc: 'https://images.unsplash.com/photo-1563106628-2ecfa840037d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/adventure/hiking',
    category: 'Nature'
  },
  {
    id: '6',
    title: 'Fishing Trips',
    description: 'Join local fishermen or charter a boat for fishing in the productive waters of the Pacific.',
    imageSrc: 'https://images.unsplash.com/photo-1516741247836-f66a30241b0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/adventure/fishing',
    category: 'Water'
  }
];

const Adventure = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero 
        title="Adventures in Cambutal"
        subtitle="Discover surfing, nature, and activities in paradise"
        imageSrc="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Experience Cambutal</h2>
          <p className="text-gray-600 mb-4">
            From world-class surfing to breathtaking nature experiences, Playa Cambutal offers endless 
            opportunities for adventure. Whether you're seeking the perfect wave, wanting to explore 
            pristine jungles, or looking to connect with nature through yoga, you'll find your perfect 
            adventure here.
          </p>
        </div>
      </section>
      
      <CardSection 
        title="Adventures & Activities"
        description="Discover the diverse range of experiences available in and around Playa Cambutal."
        items={adventureItems}
        bgColor="bg-gray-50"
      />
      
      <Featured 
        title="Surf Paradise"
        description="Playa Cambutal offers consistent waves throughout the year, making it an ideal destination for surfers of all levels. With a variety of breaks and waves ranging from gentle rollers to powerful point breaks, there's something for everyone. Local surf schools provide lessons and equipment rentals for beginners, while experienced surfers can find challenging waves during peak seasons."
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Cambutal"
        link="/adventure/surf"
        linkText="Learn more about surfing"
        imageOnRight={true}
      />
      
      <Featured 
        title="Nature & Wildlife"
        description="Immerse yourself in Panama's incredible biodiversity. Take guided tours to spot monkeys, exotic birds, and marine life. Hike through pristine rainforests, discover hidden waterfalls, or join conservation efforts to protect local wildlife. Our experienced guides ensure unforgettable encounters with nature."
        imageSrc="https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Wildlife viewing in Panama"
        link="/adventure/wildlife"
        linkText="Explore nature activities"
        imageOnRight={false}
      />
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Adventure;
