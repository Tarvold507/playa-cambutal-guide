
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContentData {
  text?: string;
  [key: string]: any;
}

interface TextFieldsProps {
  contentData: ContentData;
  updateContentData: (field: string, value: any) => void;
}

const TextFields = ({ contentData, updateContentData }: TextFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-content">Text Content</Label>
        <Textarea
          id="text-content"
          value={contentData.text || ''}
          onChange={(e) => updateContentData('text', e.target.value)}
          rows={6}
          placeholder="Enter your text content here..."
        />
      </div>
    </div>
  );
};

export default TextFields;
