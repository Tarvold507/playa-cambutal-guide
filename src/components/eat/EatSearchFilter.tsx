
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EatSearchFilterProps {
  showOpenOnly: boolean;
  setShowOpenOnly: (show: boolean) => void;
}

const EatSearchFilter = ({ 
  showOpenOnly, 
  setShowOpenOnly 
}: EatSearchFilterProps) => {
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Button 
              variant={showOpenOnly ? "default" : "outline"} 
              onClick={() => setShowOpenOnly(!showOpenOnly)}
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>{showOpenOnly ? "Showing Open Now" : "Show Open Now"}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EatSearchFilter;
