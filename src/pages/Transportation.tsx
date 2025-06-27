
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import TransportationSEO from '../components/transportation/TransportationSEO';

const Transportation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TransportationSEO />
      <Navbar />
      
      <Hero 
        title="Getting to Playa Cambutal"
        subtitle="Complete transportation guide for international visitors traveling to Panama's hidden paradise."
        imageSrc="https://images.unsplash.com/photo-1596627116790-af6f46dddbae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Getting to Playa Cambutal</h1>
            <h2 className="text-2xl text-gray-600 mb-8">Transportation Options & Travel Tips</h2>
            
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Flying to Panama</h3>
              <p className="text-lg text-gray-600 mb-6">
                Most international visitors arrive at Tocumen International Airport (PTY) in Panama City. 
                Major airlines serve Panama from North America, Europe, and other international destinations.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h4 className="font-semibold text-gray-800 mb-2">Flight Information for International Travelers:</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li><strong>From North America:</strong> Direct flights from Miami (1.5h), New York (5.5h), Toronto (7h)</li>
                  <li><strong>From Europe:</strong> Direct flights from Madrid (10h), Amsterdam (11h), Frankfurt (12h)</li>
                  <li><strong>From South America:</strong> Multiple daily connections via major cities</li>
                  <li><strong>Entry Requirements:</strong> Most visitors need only a passport (no visa required for stays under 90 days)</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Panama City to Cambutal</h3>
              <p className="text-gray-600 mb-6">
                The journey from Panama City to Playa Cambutal takes approximately 4-5 hours by road. 
                Here are your transportation options:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">🚗 Rental Car (Recommended)</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Freedom to explore at your own pace</li>
                    <li>• Cost: $30-50/day plus gas (~$40 each way)</li>
                    <li>• Major rental companies available at airport</li>
                    <li>• GPS essential - download offline maps</li>
                    <li>• International driving permit recommended</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">🚌 Bus + Transfer</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Most economical option ($15-25 total)</li>
                    <li>• Bus to Las Tablas, then taxi to Cambutal</li>
                    <li>• Total journey: 6-7 hours</li>
                    <li>• Limited schedule - plan accordingly</li>
                    <li>• Adventure travelers love this option</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">🚐 Private Transfer</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Most comfortable and convenient</li>
                    <li>• Cost: $200-300 for up to 6 passengers</li>
                    <li>• Door-to-door service</li>
                    <li>• Can be arranged through your accommodation</li>
                    <li>• Perfect for groups or families</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">✈️ Domestic Flight + Transfer</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Fastest option to the region</li>
                    <li>• Fly to Chitré, then 90-minute drive</li>
                    <li>• Cost: $100-150 plus ground transfer</li>
                    <li>• Limited flight schedule</li>
                    <li>• Great for short trips</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Essential Travel Tips for International Visitors</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">💰 Currency & Payments</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Panama uses the US Dollar - no currency exchange needed for Americans</li>
                  <li>ATMs available in Las Tablas (30 minutes from Cambutal)</li>
                  <li>Bring cash - many local businesses don't accept cards</li>
                  <li>Notify your bank of international travel</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">📱 Communication</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Most accommodations offer WiFi</li>
                  <li>Local SIM cards available at airport and in Panama City</li>
                  <li>International roaming can be expensive - check with your provider</li>
                  <li>WhatsApp is widely used for local communication</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Around Cambutal</h3>
              <p className="text-gray-600 mb-4">
                Once in Cambutal, most accommodations and attractions are within walking distance or a short bike ride. 
                Many hotels offer bicycle rentals, and local taxis are available for longer trips.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Pro Tips for International Travelers:</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Download offline maps before you travel</li>
                  <li>Learn basic Spanish phrases - locals appreciate the effort</li>
                  <li>Pack light - laundry services are available</li>
                  <li>Bring reef-safe sunscreen (hard to find locally)</li>
                  <li>Consider travel insurance for adventure activities</li>
                </ul>
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

export default Transportation;
