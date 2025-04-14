
import { useEffect } from 'react';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Featured from '../components/Featured';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sample data for our sections
const cardItems = [
  {
    id: '1',
    title: 'Beautiful Beachfront Hotels',
    description: 'Wake up to the sound of waves with our selection of beachfront accommodations in Playa Venao.',
    imageSrc: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay',
    category: 'Stay'
  },
  {
    id: '2',
    title: 'Local & International Cuisine',
    description: 'Explore a diverse array of restaurants and cafes offering everything from local delicacies to international favorites.',
    imageSrc: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/eat',
    category: 'Eat'
  },
  {
    id: '3',
    title: 'Catch the Perfect Wave',
    description: 'Playa Venao is famous for its consistent waves, making it a paradise for surfers of all levels.',
    imageSrc: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf',
    category: 'Surf'
  },
  {
    id: '4',
    title: 'Yoga & Wellness',
    description: 'Find your zen with beachfront yoga classes and wellness activities for mind and body rejuvenation.',
    imageSrc: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do',
    category: 'Do'
  },
  {
    id: '5',
    title: 'Wildlife Excursions',
    description: 'Discover the rich biodiversity of Panama with guided tours to see monkeys, birds, and marine life.',
    imageSrc: 'https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/do',
    category: 'Do'
  },
  {
    id: '6',
    title: 'Transportation Options',
    description: 'Find the best ways to get to and around Playa Venao, from airport shuttles to local taxis.',
    imageSrc: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/transportation',
    category: 'Transport'
  }
];

const Index = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Discover Playa Venao"
        subtitle="Your comprehensive guide to Panama's surf paradise"
        imageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Welcome to Playa Venao</h2>
          <p className="text-gray-600 mb-4">
            Nestled on Panama's Pacific coast, Playa Venao is a horseshoe-shaped bay known for its consistent waves, 
            stunning sunsets, and laid-back atmosphere. Once a hidden gem, it has evolved into a beloved destination 
            for surfers, travelers, and those seeking a connection with nature.
          </p>
          <p className="text-gray-600">
            Whether you're planning your first visit or returning to this paradise, our guide provides everything 
            you need to make the most of your Playa Venao experience.
          </p>
        </div>
      </section>
      
      {/* Card Section */}
      <CardSection 
        title="Explore Playa Venao"
        description="Discover the best places to eat, stay, and play in this beautiful beach destination."
        items={cardItems}
        bgColor="bg-gray-50"
      />
      
      {/* Featured Section */}
      <Featured 
        title="Perfect Waves Year Round"
        description="Playa Venao offers consistent surf conditions throughout the year, making it an ideal destination for surfers of all levels. With a variety of breaks and waves ranging from gentle rollers to powerful point breaks, there's something for everyone. Local surf schools provide lessons and equipment rentals for beginners, while experienced surfers can find challenging waves, especially during the swell season from March to November."
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Venao"
        link="/surf"
        linkText="Learn more about surfing"
        imageOnRight={true}
      />
      
      {/* Second Featured Section */}
      <Featured 
        title="Culinary Delights"
        description="From beachfront seafood shacks to upscale international restaurants, Playa Venao's food scene is surprisingly diverse for such a small beach town. Enjoy fresh-caught fish, traditional Panamanian dishes, wood-fired pizzas, and farm-to-table organic offerings. Many restaurants source local ingredients, and vegetarian and vegan options are increasingly available. Don't miss the chance to sample local specialties like ceviche and patacones while watching the sunset over the Pacific."
        imageSrc="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Delicious food at a beachfront restaurant"
        link="/eat"
        linkText="Discover local restaurants"
        imageOnRight={false}
      />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
