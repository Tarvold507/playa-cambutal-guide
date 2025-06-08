
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';

interface FeaturedFieldsProps {
  contentData: any;
  updateContentData: (field: string, value: any) => void;
  onImageUpload: (file: File, field: string) => Promise<void>;
  uploading: boolean;
}

const FeaturedFields = ({ contentData, updateContentData, onImageUpload, uploading }: FeaturedFieldsProps) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImageUpload(file, 'imageSrc');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="featured-title">Title</Label>
        <Input
          id="featured-title"
          value={contentData.title || ''}
          onChange={(e) => updateContentData('title', e.target.value)}
          placeholder="Enter featured section title"
        />
      </div>
      
      <div>
        <Label htmlFor="featured-description">Description</Label>
        <Textarea
          id="featured-description"
          value={contentData.description || ''}
          onChange={(e) => updateContentData('description', e.target.value)}
          placeholder="Enter featured section description"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="featured-image">Featured Image</Label>
        <div className="space-y-2">
          <Input
            id="featured-image"
            value={contentData.imageSrc || ''}
            onChange={(e) => updateContentData('imageSrc', e.target.value)}
            placeholder="Enter image URL or upload below"
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="featured-alt">Image Alt Text</Label>
        <Input
          id="featured-alt"
          value={contentData.imageAlt || ''}
          onChange={(e) => updateContentData('imageAlt', e.target.value)}
          placeholder="Enter image alt text for accessibility"
        />
      </div>

      <div>
        <Label htmlFor="featured-link">Link URL</Label>
        <Input
          id="featured-link"
          value={contentData.link || ''}
          onChange={(e) => updateContentData('link', e.target.value)}
          placeholder="Enter link URL (e.g., /surf)"
        />
      </div>

      <div>
        <Label htmlFor="featured-link-text">Link Text</Label>
        <Input
          id="featured-link-text"
          value={contentData.linkText || ''}
          onChange={(e) => updateContentData('linkText', e.target.value)}
          placeholder="Enter link text"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="image-position"
          checked={contentData.imageOnRight || false}
          onCheckedChange={(checked) => updateContentData('imageOnRight', checked)}
        />
        <Label htmlFor="image-position">Image on Right Side</Label>
      </div>
    </div>
  );
};

export default FeaturedFields;
