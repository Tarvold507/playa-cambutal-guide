
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const EatAddRestaurant = () => {
  const { user } = useAuth();

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Own a Restaurant in Cambutal?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our directory and reach more customers! Add your restaurant to our platform and showcase your 
          cuisine to food lovers from around the world.
        </p>
        <Link 
          to={user ? '/add-restaurant' : '/auth'}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-venao-dark text-primary-foreground hover:bg-venao-dark/90 h-11 rounded-md px-8"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Your Restaurant
        </Link>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            You'll need to sign in to add a restaurant listing.
          </p>
        )}
      </div>
    </section>
  );
};

export default EatAddRestaurant;
