
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SectionFieldsProps {
  contentData: any;
  updateContentData: (field: string, value: any) => void;
}

const SectionFields = ({ contentData, updateContentData }: SectionFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="section-title">Section Title</Label>
        <Input
          id="section-title"
          value={contentData.title || ''}
          onChange={(e) => updateContentData('title', e.target.value)}
          placeholder="Enter section title"
        />
      </div>
      
      <div>
        <Label htmlFor="section-description">Description</Label>
        <Textarea
          id="section-description"
          value={contentData.description || ''}
          onChange={(e) => updateContentData('description', e.target.value)}
          placeholder="Enter section description"
          rows={3}
        />
      </div>
    </div>
  );
};

export default SectionFields;
