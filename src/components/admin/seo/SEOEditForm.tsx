
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageSEO } from '@/hooks/usePageSEO';

interface SEOEditFormProps {
  formData: Partial<PageSEO>;
  onChange: (data: Partial<PageSEO>) => void;
}

export const SEOEditForm = ({ formData, onChange }: SEOEditFormProps) => {
  const updateField = (field: keyof PageSEO, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="page_title">Page Title</Label>
        <Input
          id="page_title"
          value={formData.page_title || ''}
          onChange={(e) => updateField('page_title', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          value={formData.meta_description || ''}
          onChange={(e) => updateField('meta_description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="meta_keywords">Meta Keywords</Label>
        <Input
          id="meta_keywords"
          value={formData.meta_keywords || ''}
          onChange={(e) => updateField('meta_keywords', e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="og_title">Open Graph Title</Label>
          <Input
            id="og_title"
            value={formData.og_title || ''}
            onChange={(e) => updateField('og_title', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="og_image">Open Graph Image</Label>
          <Input
            id="og_image"
            value={formData.og_image || ''}
            onChange={(e) => updateField('og_image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="og_description">Open Graph Description</Label>
        <Textarea
          id="og_description"
          value={formData.og_description || ''}
          onChange={(e) => updateField('og_description', e.target.value)}
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="canonical_url">Canonical URL</Label>
        <Input
          id="canonical_url"
          value={formData.canonical_url || ''}
          onChange={(e) => updateField('canonical_url', e.target.value)}
          placeholder="https://playacambutalguide.com/page"
        />
      </div>
    </div>
  );
};
