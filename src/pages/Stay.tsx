
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Newsletter from '../components/Newsletter';

const stayItems = [
  {
    id: '1',
    title: 'Luxury Beachfront Resort',
    description: 'Experience the ultimate beachfront luxury with stunning views, infinity pools, and world-class amenities.',
    imageSrc: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay/luxury-resort',
    category: 'Resort'
  },
  {
    id: '2',
    title: 'Eco Lodge',
    description: 'Immerse yourself in nature at this sustainable eco-lodge with private cabins nestled in the jungle.',
    imageSrc: 'https://images.unsplash.com/photo-1604624483037-15e7e9301a0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay/eco-lodge',
    category: 'Eco'
  },
  {
    id: '3',
    title: 'Boutique Surf Hotel',
    description: 'Modern and stylish accommodations designed specifically for surfers, with board storage and surf-focused amenities.',
    imageSrc: 'https://images.unsplash.com/photo-1601912995198-58c32fed2d3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay/surf-hotel',
    category: 'Boutique'
  },
  {
    id: '4',
    title: 'Budget Surf Hostel',
    description: 'Affordable dorm and private rooms with a social atmosphere, perfect for travelers on a budget.',
    imageSrc: 'https://images.unsplash.com/photo-1555854877-b3d5425b6b0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay/hostel',
    category: 'Hostel'
  },
  {
    id: '5',
    title: 'Beachfront Cabanas',
    description: 'Simple but comfortable private cabanas located right on the beach, fall asleep to the sound of waves.',
    imageSrc: 'https://images.unsplash.com/photo-1583596561917-37adcf601194?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay/cabanas',
    category: 'Cabanas'
  },
  {
    id: '6',
    title: 'Vacation Rentals',
    description: 'Fully equipped apartments and houses perfect for families or groups wanting more space and privacy.',
    imageSrc: 'https://images.unsplash.com/photo-1545158361-2f785653e2f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    link: '/stay/vacation-rentals',
    category: 'Rentals'
  }
];

const Stay = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Places to Stay"
        subtitle="Find your perfect accommodation in Playa Venao"
        imageSrc="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Find Your Perfect Stay</h2>
          <p className="text-gray-600 mb-4">
            Playa Venao offers a wide range of accommodations to suit every budget and travel style. From luxury 
            resorts to eco-friendly hostels, you'll find the perfect place to call home during your stay.
          </p>
          <p className="text-gray-600">
            Most accommodations are located either right on the beach or within a short walking distance, allowing 
            you to easily enjoy all that Playa Venao has to offer.
          </p>
        </div>
      </section>
      
      {/* Accommodation Listings */}
      <CardSection 
        title="Accommodations"
        description="From luxury resorts to budget-friendly hostels, find your perfect place to stay."
        items={stayItems}
        bgColor="bg-gray-50"
      />
      
      {/* Accommodation Tips Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Accommodation Tips</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Best Time to Book</h3>
                <p className="text-gray-600">We recommend booking your accommodation at least 3-4 months in advance for high season (December-April) and 1-2 months ahead for low season. Many places offer discounts for longer stays.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Location Considerations</h3>
                <p className="text-gray-600">The bay is horseshoe-shaped, with accommodations spread along its curve. The center offers easy access to most restaurants and services, while the ends provide more tranquility but may require transportation for getting around.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Amenities to Look For</h3>
                <p className="text-gray-600">Since Playa Venao can get quite hot, air conditioning or good fans are essential for comfort. Also consider if you need WiFi (quality varies), kitchen facilities, and whether the property has a generator (occasional power outages happen).</p>
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

export default Stay;
