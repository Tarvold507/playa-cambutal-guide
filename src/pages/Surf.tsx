
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';

const surfItems = [
  {
    id: '1',
    title: 'Beginner Surf Lessons',
    description: 'Start your surfing journey with professional instructors in the perfect learning environment of Playa Venao.',
    imageSrc: 'https://images.unsplash.com/photo-1526342482877-8b16ae8a9098?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf/lessons',
    category: 'Lessons'
  },
  {
    id: '2',
    title: 'Board Rentals',
    description: 'Quality surfboards available for rent, from beginner foam boards to performance shortboards.',
    imageSrc: 'https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf/rentals',
    category: 'Rentals'
  },
  {
    id: '3',
    title: 'Advanced Coaching',
    description: 'Take your surfing to the next level with personalized coaching from experienced surfers.',
    imageSrc: 'https://images.unsplash.com/photo-1551144366-e5b4a1554962?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf/coaching',
    category: 'Coaching'
  },
  {
    id: '4',
    title: 'Surf Camps',
    description: 'Immersive surf experiences with accommodation, lessons, and meals all included.',
    imageSrc: 'https://images.unsplash.com/photo-1517699418036-fb5d179fef0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf/camps',
    category: 'Camps'
  },
  {
    id: '5',
    title: 'Surf Photography',
    description: 'Capture your surfing moments with professional photographers who specialize in surf photography.',
    imageSrc: 'https://images.unsplash.com/photo-1618520258886-3ec1efcbfbd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf/photography',
    category: 'Photography'
  },
  {
    id: '6',
    title: 'Surf Guides',
    description: 'Explore the best surf spots around Playa Venao with local guides who know when and where to find the best waves.',
    imageSrc: 'https://images.unsplash.com/photo-1559176863-a115e3e6b0b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/surf/guides',
    category: 'Guides'
  }
];

const Surf = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Surf Paradise"
        subtitle="Catch the perfect wave in Playa Venao"
        imageSrc="https://images.unsplash.com/photo-1530684585734-6979140f1d82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">A Surfer's Paradise</h2>
          <p className="text-gray-600 mb-4">
            Playa Venao is renowned for its consistent waves and versatile surf conditions, making it one of 
            Panama's premier surf destinations. The beach's horseshoe shape creates different breaks suitable 
            for all levels of surfers.
          </p>
          <p className="text-gray-600">
            Whether you're a complete beginner looking to catch your first wave or an experienced surfer seeking 
            challenging rides, Playa Venao offers year-round opportunities to enjoy this incredible sport.
          </p>
        </div>
      </section>
      
      {/* Surf Services */}
      <CardSection 
        title="Surf Services"
        description="Everything you need to make the most of your surfing experience in Playa Venao."
        items={surfItems}
        bgColor="bg-gray-50"
      />
      
      {/* Wave Guide Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Seasonal Surf Guide</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Dry Season (December - April)</h3>
                <p className="text-gray-600">Consistent offshore winds and moderate-sized swells make this the most popular time for surfing. The waves are generally more manageable and perfect for intermediate surfers, while still offering occasional bigger days for experienced riders.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Green Season (May - November)</h3>
                <p className="text-gray-600">The rainy season brings larger swells, particularly between June and August. This is when experienced surfers will find the most challenging waves. Morning sessions are usually best as afternoon rains and winds can affect conditions.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Best Spots</h3>
                <p className="text-gray-600">The main beach break at Playa Venao works on all tides and offers various peaks. The right side (looking at the ocean) tends to be better for beginners, while the center and left side can provide more powerful waves for intermediate and advanced surfers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Surf Etiquette Section */}
      <section className="bg-venao-light py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Surf Etiquette</h2>
            <p className="mb-6">
              Respecting local surf etiquette helps ensure everyone has a safe and enjoyable experience:
            </p>
            
            <ul className="space-y-3 list-disc pl-5">
              <li>Wait your turn and don't drop in on other surfers</li>
              <li>The surfer closest to the peak has right of way</li>
              <li>Communicate with other surfers using calls like "Left!" or "Right!"</li>
              <li>Don't paddle through the lineup; paddle around it</li>
              <li>Respect locals and the environment</li>
              <li>Know your limits and surf within your ability</li>
            </ul>
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

export default Surf;
