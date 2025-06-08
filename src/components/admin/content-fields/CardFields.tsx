
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ContentData {
  title?: string;
  description?: string;
  imageSrc?: string;
  link?: string;
  [key: string]: any;
}

interface CardFieldsProps {
  contentData: ContentData;
  updateContentData: (field: string, value: any) => void;
  onImageUpload: (file: File, field: string) => void;
  uploading: boolean;
}

const CardFields = ({ contentData, updateContentData, onImageUpload, uploading }: CardFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="card-title">Card Title</Label>
        <Input
          id="card-title"
          value={contentData.title || ''}
          onChange={(e) => updateContentData('title', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="card-description">Description</Label>
        <Textarea
          id="card-description"
          value={contentData.description || ''}
          onChange={(e) => updateContentData('description', e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="card-image">Card Image</Label>
        <div className="flex items-center gap-4">
          <Input
            id="card-image"
            value={contentData.imageSrc || ''}
            onChange={(e) => updateContentData('imageSrc', e.target.value)}
            placeholder="Image URL or upload below"
          />
          <label className="cursor-pointer">
            <Button type="button" variant="outline" disabled={uploading} asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file, 'imageSrc');
              }}
            />
          </label>
        </div>
      </div>
      <div>
        <Label htmlFor="card-link">Link URL (optional)</Label>
        <Input
          id="card-link"
          value={contentData.link || ''}
          onChange={(e) => updateContentData('link', e.target.value)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

export default CardFields;
