
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, FileText } from 'lucide-react';

interface SEOFilterControlsProps {
  filterType: string;
  onFilterChange: (value: string) => void;
  onBulkRefresh: () => void;
  onTestRegeneration: () => void;
  isRegenerating: boolean;
}

export const SEOFilterControls = ({ 
  filterType, 
  onFilterChange, 
  onBulkRefresh, 
  onTestRegeneration,
  isRegenerating 
}: SEOFilterControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Label htmlFor="filter">Filter by type:</Label>
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            <SelectItem value="static">Static Pages</SelectItem>
            <SelectItem value="hotel">Hotels</SelectItem>
            <SelectItem value="restaurant">Restaurants</SelectItem>
            <SelectItem value="event">Events</SelectItem>
            <SelectItem value="blog">Blog Posts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onTestRegeneration} 
          variant="outline" 
          size="sm"
          disabled={isRegenerating}
        >
          <FileText className="w-4 h-4 mr-2" />
          {isRegenerating ? 'Testing...' : 'Test SEO Regeneration'}
        </Button>
        <Button onClick={onBulkRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All
        </Button>
      </div>
    </div>
  );
};
