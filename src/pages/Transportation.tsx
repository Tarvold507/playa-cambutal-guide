
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import { Car, PlaneTakeoff, MapPin, AlertTriangle, Clock, DollarSign } from 'lucide-react';

const Transportation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Getting There & Around"
        subtitle="Transportation options for Playa Venao"
        imageSrc="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Getting to Paradise</h2>
          <p className="text-gray-600 mb-4">
            Playa Venao is located on the Azuero Peninsula in Panama, approximately 5-6 hours from Panama City. 
            While the journey may take some time, the destination is well worth the effort.
          </p>
          <p className="text-gray-600">
            There are several transportation options available, from rental cars to private shuttles and public buses.
            Choose the one that best suits your travel style, budget, and schedule.
          </p>
        </div>
      </section>
      
      {/* Transportation Options */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Transportation Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* From Panama City */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-venao text-white p-4 flex items-center">
                <PlaneTakeoff className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">From Panama City</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Rental Car</h4>
                  <p className="text-gray-600">The most flexible option. Drive time is approximately 5-6 hours from Panama City. The roads are generally in good condition, with the last 30 minutes on unpaved roads.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Private Shuttle</h4>
                  <p className="text-gray-600">Several companies offer door-to-door service from Panama City to Playa Venao. Prices range from $60-120 per person depending on group size.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Public Bus</h4>
                  <p className="text-gray-600">Budget option. Take a bus from Albrook Terminal to Las Tablas, then a local bus or taxi to Playa Venao. Total cost is around $15-25 but takes 7-8 hours.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Flights + Taxi</h4>
                  <p className="text-gray-600">Fly from Panama City to Chitré or Pedasí, then take a taxi to Playa Venao (45-90 minutes). Faster but more expensive.</p>
                </div>
              </div>
            </div>
            
            {/* Getting Around */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-venao text-white p-4 flex items-center">
                <Car className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">Getting Around</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Walking</h4>
                  <p className="text-gray-600">Playa Venao itself is compact enough to explore on foot. The beach is approximately 3 km long, and most accommodations, restaurants, and shops are within walking distance.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Rental Car</h4>
                  <p className="text-gray-600">Useful if you're planning to explore beyond Playa Venao. Some accommodations offer car rentals, or you can arrange one in advance.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Taxi Services</h4>
                  <p className="text-gray-600">Local taxis are available for transportation to nearby towns. Your accommodation can usually arrange this for you.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Bicycles & ATVs</h4>
                  <p className="text-gray-600">Several places offer bicycle and ATV rentals, which are fun ways to explore the area and nearby beaches.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Tips */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Travel Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg flex">
              <div className="mr-4 text-venao">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Navigation</h3>
                <p className="text-gray-600">Download offline maps before your trip as cell service can be spotty. Google Maps works well for most routes to Playa Venao.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg flex">
              <div className="mr-4 text-venao">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Road Conditions</h3>
                <p className="text-gray-600">The last part of the journey has unpaved roads. During rainy season (May-November), a 4x4 vehicle is recommended.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg flex">
              <div className="mr-4 text-venao">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Travel Time</h3>
                <p className="text-gray-600">Add buffer time to your journey, especially if traveling during rush hours or the rainy season when delays are common.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg flex">
              <div className="mr-4 text-venao">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Gas Stations</h3>
                <p className="text-gray-600">Fill up your tank before heading to Playa Venao. The closest gas stations are in Las Tablas and Pedasí.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg flex col-span-1 md:col-span-2">
              <div className="mr-4 text-venao">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recommended Transportation Services</h3>
                <p className="text-gray-600">
                  For shuttle services, we recommend Venao Express and Las Tablas Transport. For taxis in the area, ask your accommodation for trusted drivers' contact information.
                </p>
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

export default Transportation;
