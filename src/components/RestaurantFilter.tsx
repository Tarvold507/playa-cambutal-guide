
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface RestaurantFilterProps {
  onFilterChange: (showOpenOnly: boolean) => void;
}

const RestaurantFilter = ({ onFilterChange }: RestaurantFilterProps) => {
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const handleToggle = () => {
    const newValue = !showOpenOnly;
    setShowOpenOnly(newValue);
    onFilterChange(newValue);
  };

  return (
    <div className="flex justify-center mb-8">
      <Button 
        variant={showOpenOnly ? "default" : "outline"} 
        onClick={handleToggle}
        className="flex items-center space-x-2"
      >
        <Clock className="h-4 w-4" />
        <span>{showOpenOnly ? "Showing Open Now" : "Show Open Now"}</span>
      </Button>
    </div>
  );
};

export default RestaurantFilter;
