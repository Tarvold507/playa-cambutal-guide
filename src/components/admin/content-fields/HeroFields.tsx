
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ContentData {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  [key: string]: any;
}

interface HeroFieldsProps {
  contentData: ContentData;
  updateContentData: (field: string, value: any) => void;
  onImageUpload: (file: File, field: string) => void;
  uploading: boolean;
}

const HeroFields = ({ contentData, updateContentData, onImageUpload, uploading }: HeroFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={contentData.title || ''}
          onChange={(e) => updateContentData('title', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          value={contentData.subtitle || ''}
          onChange={(e) => updateContentData('subtitle', e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="background-image">Background Image</Label>
        <div className="flex items-center gap-4">
          <Input
            id="background-image"
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
        {contentData.imageSrc && (
          <div className="mt-2">
            <img
              src={contentData.imageSrc}
              alt="Preview"
              className="w-32 h-20 object-cover rounded border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroFields;
