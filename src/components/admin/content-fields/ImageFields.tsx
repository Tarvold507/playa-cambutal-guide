
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ContentData {
  url?: string;
  alt?: string;
  caption?: string;
  [key: string]: any;
}

interface ImageFieldsProps {
  contentData: ContentData;
  updateContentData: (field: string, value: any) => void;
  onImageUpload: (file: File, field: string) => void;
  uploading: boolean;
}

const ImageFields = ({ contentData, updateContentData, onImageUpload, uploading }: ImageFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-url">Image URL</Label>
        <div className="flex items-center gap-4">
          <Input
            id="image-url"
            value={contentData.url || ''}
            onChange={(e) => updateContentData('url', e.target.value)}
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
                if (file) onImageUpload(file, 'url');
              }}
            />
          </label>
        </div>
        {contentData.url && (
          <div className="mt-2">
            <img
              src={contentData.url}
              alt="Preview"
              className="w-32 h-20 object-cover rounded border"
            />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="alt-text">Alt Text</Label>
        <Input
          id="alt-text"
          value={contentData.alt || ''}
          onChange={(e) => updateContentData('alt', e.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </div>
      <div>
        <Label htmlFor="caption">Caption (optional)</Label>
        <Input
          id="caption"
          value={contentData.caption || ''}
          onChange={(e) => updateContentData('caption', e.target.value)}
          placeholder="Image caption"
        />
      </div>
    </div>
  );
};

export default ImageFields;
