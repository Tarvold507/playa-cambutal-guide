
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import RealEstateSEO from '../components/real-estate/RealEstateSEO';

const RealEstate = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <RealEstateSEO />
      <Navbar />
      
      <Hero 
        title="Real Estate in Playa Cambutal"
        subtitle="Discover prime beachfront properties and investment opportunities in Panama's emerging paradise."
        imageSrc="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Real Estate in Playa Cambutal</h1>
            <h2 className="text-2xl text-gray-600 mb-8">Beach Properties & Investment Opportunities</h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Playa Cambutal represents one of Panama's most promising real estate markets, offering international 
                investors unique opportunities in an emerging beachfront destination with world-class surfing and 
                pristine natural beauty.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Invest in Cambutal Real Estate?</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Pristine beachfront location with consistent surf breaks</li>
                <li>Growing international recognition as a surf destination</li>
                <li>Panama's friendly foreign investment policies</li>
                <li>No restrictions on foreign property ownership</li>
                <li>Developing infrastructure and improving accessibility</li>
                <li>Strong rental potential for vacation properties</li>
                <li>Lower prices compared to other Central American beach destinations</li>
              </ul>
              
              <div className="bg-green-50 p-6 rounded-lg mb-8">
                <h4 className="font-semibold text-gray-800 mb-3">🏡 Property Types Available</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Beachfront Lots</h5>
                    <p className="text-sm text-gray-600">Prime oceanfront land perfect for luxury vacation homes or rental properties.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Existing Homes</h5>
                    <p className="text-sm text-gray-600">Fully built properties ready for immediate use or rental income.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Development Land</h5>
                    <p className="text-sm text-gray-600">Larger parcels suitable for boutique hotels or residential developments.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Commercial Properties</h5>
                    <p className="text-sm text-gray-600">Restaurant, hotel, and retail opportunities in the growing tourist area.</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Investment Considerations for International Buyers</h3>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">💼 Legal & Financial Advantages</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Panama uses US Dollar - no currency risk for American investors</li>
                  <li>Established legal system based on civil law</li>
                  <li>Title insurance available through reputable companies</li>
                  <li>No capital gains tax on real estate for individuals</li>
                  <li>Property taxes are very low (typically under $500/year)</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">🔍 Due Diligence Tips</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Always work with a qualified Panamanian attorney</li>
                  <li>Verify clear title through the Public Registry</li>
                  <li>Understand water and utility access for your property</li>
                  <li>Check local zoning and development restrictions</li>
                  <li>Visit the property multiple times and in different seasons</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Rental Income Potential</h3>
              <p className="text-gray-600 mb-4">
                Cambutal's growing popularity as a surf and eco-tourism destination creates strong rental demand. 
                Well-positioned properties can generate significant returns through vacation rentals, especially 
                during peak surf season (April-October).
              </p>
              
              <div className="bg-purple-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">💰 Estimated Rental Returns</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li><strong>Beachfront Homes:</strong> $150-300/night (seasonal)</li>
                  <li><strong>Ocean View Properties:</strong> $100-200/night</li>
                  <li><strong>Standard Homes:</strong> $50-100/night</li>
                  <li><strong>Annual Gross Yields:</strong> 8-15% for well-managed properties</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
              <p className="text-gray-600 mb-4">
                Whether you're looking for a vacation home, rental investment, or development opportunity, 
                Cambutal offers compelling options for international real estate investors. The key is working 
                with experienced local professionals who understand both the market and legal requirements.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Next Steps for Interested Investors:</h4>
                <ol className="list-decimal pl-6 text-gray-600">
                  <li>Connect with a qualified local real estate attorney</li>
                  <li>Partner with a reputable local real estate agent</li>
                  <li>Visit Cambutal to see properties in person</li>
                  <li>Understand local regulations and development plans</li>
                  <li>Consider property management options for rentals</li>
                </ol>
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
