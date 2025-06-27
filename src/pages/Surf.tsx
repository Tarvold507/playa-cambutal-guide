
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import SurfSEO from '../components/surf/SurfSEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Surf = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SurfSEO />
      <Navbar />
      
      <Hero 
        title="Surf Playa Cambutal"
        subtitle="World-class surf breaks with consistent waves year-round. Perfect for surfers from North America, Europe, and beyond."
        imageSrc="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Surf Playa Cambutal</h1>
            <h2 className="text-2xl text-gray-600 mb-8">World-Class Surf Breaks in Panama</h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Playa Cambutal is renowned for its consistent, world-class surf breaks that attract surfers from around the globe. 
                Located on Panama's Pacific coast, this horseshoe-shaped bay offers perfect waves for all skill levels.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Cambutal is Perfect for International Surfers</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Consistent waves year-round with offshore winds</li>
                <li>Multiple surf breaks for different skill levels</li>
                <li>Warm water temperature (80-85°F) - no wetsuit needed</li>
                <li>Less crowded than other Central American surf spots</li>
                <li>Easy access from Panama City (4-hour drive)</li>
                <li>English-speaking surf guides and instructors available</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Best Surf Conditions</h3>
              <p className="text-gray-600 mb-4">
                The surf season runs from April to October, with the most consistent swells during the rainy season. 
                Wave heights typically range from 3-8 feet, with occasional larger sets during peak swells.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Surf Spots Around Cambutal</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li><strong>The Point:</strong> A right-hand point break perfect for intermediate to advanced surfers</li>
                <li><strong>Inside Section:</strong> Ideal for beginners and longboarders</li>
                <li><strong>Outside Reef:</strong> Challenging break for experienced surfers</li>
                <li><strong>Nearby Breaks:</strong> Easily accessible surf spots within 30 minutes</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Planning Your Surf Trip</h3>
              <p className="text-gray-600 mb-4">
                For international visitors, we recommend staying 5-7 days minimum to experience different conditions. 
                Most accommodations in Cambutal cater specifically to surfers, offering board storage, 
                wax, and local surf guidance.
              </p>
              
              <p className="text-gray-600">
                Ready to experience world-class surfing in paradise? Browse our recommended surf lodges and 
                local surf guides to plan your perfect Cambutal surf adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Surf;
