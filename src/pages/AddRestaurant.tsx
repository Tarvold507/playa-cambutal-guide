
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantSubmissionForm from '../components/RestaurantSubmissionForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddRestaurant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to add a restaurant listing.</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSuccess = () => {
    navigate('/eat');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/eat')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Eat & Drink
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Your Restaurant</h1>
            <p className="text-gray-600">
              Submit your restaurant for review. Once approved by our team, it will be visible to all users.
            </p>
          </div>

          <RestaurantSubmissionForm onSuccess={handleSuccess} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddRestaurant;
