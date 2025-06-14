
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const StayAddProperty = () => {
  const { user } = useAuth();

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Own a Hotel in Cambutal?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our directory and reach more guests! Add your accommodation to our platform and showcase your 
          property to travelers from around the world.
        </p>
        <Button 
          onClick={() => window.location.href = user ? '/add-hotel' : '/auth'}
          size="lg"
          className="bg-venao-dark hover:bg-venao-dark/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Your Property
        </Button>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            You'll need to sign in to add a property listing.
          </p>
        )}
      </div>
    </section>
  );
};

export default StayAddProperty;
