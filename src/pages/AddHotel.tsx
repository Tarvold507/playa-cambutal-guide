
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelSubmissionForm from '../components/HotelSubmissionForm';

const AddHotel = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Add Your Hotel
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our directory of accommodations in Playa Cambutal. Submit your property 
            details and start reaching more guests through our platform.
          </p>
        </div>
        
        <HotelSubmissionForm />
      </div>
      
      <Footer />
    </div>
  );
};

export default AddHotel;
