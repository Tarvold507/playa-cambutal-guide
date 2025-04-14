
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';

const realEstateItems = [
  {
    id: '1',
    title: 'Beachfront Land',
    description: 'Prime beachfront lots available for development, perfect for your dream home or boutique hotel project.',
    imageSrc: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/real-estate/beachfront',
    category: 'Land'
  },
  {
    id: '2',
    title: 'Ocean View Properties',
    description: 'Stunning properties with panoramic ocean views, situated on the hills overlooking Playa Cambutal.',
    imageSrc: 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/real-estate/ocean-view',
    category: 'Houses'
  },
  {
    id: '3',
    title: 'Investment Properties',
    description: 'Turn-key investment opportunities including existing businesses and development projects.',
    imageSrc: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/real-estate/investment',
    category: 'Investment'
  }
];

const RealEstate = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Hero 
        title="Real Estate"
        subtitle="Find your piece of paradise in Playa Cambutal"
        imageSrc="https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Invest in Paradise</h2>
          <p className="text-gray-600 mb-4">
            Playa Cambutal offers unique real estate opportunities, from beachfront lots to turnkey businesses. 
            Whether you're looking for a vacation home, permanent residence, or investment property, our local 
            experts can help you find the perfect match.
          </p>
          <p className="text-gray-600">
            The area is developing sustainably while maintaining its natural beauty and charm, making it an 
            excellent time to invest in this growing paradise.
          </p>
        </div>
      </section>
      
      <CardSection 
        title="Available Properties"
        description="Explore our selection of prime real estate opportunities in Playa Cambutal."
        items={realEstateItems}
        bgColor="bg-gray-50"
      />
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Investment Guide</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Property Types</h3>
                <p className="text-gray-600">From raw land to developed properties, Playa Cambutal offers various investment opportunities. Beachfront lots, ocean view properties, and existing businesses are all available.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Buying Process</h3>
                <p className="text-gray-600">Our team can guide you through the entire purchase process, from property selection to closing. We work with trusted local lawyers and can help coordinate all necessary steps.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Investment Potential</h3>
                <p className="text-gray-600">With growing tourism and infrastructure development, Playa Cambutal represents an exciting investment opportunity while still maintaining its natural charm and peaceful atmosphere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default RealEstate;
