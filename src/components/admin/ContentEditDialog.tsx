
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContent } from '@/hooks/usePageContent';
import { useCMSImages } from '@/hooks/useCMSImages';
import { Upload, X } from 'lucide-react';

interface ContentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: PageContent | null;
  pagePath: string;
  onSave: (content: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) => void;
}

const ContentEditDialog = ({ isOpen, onClose, content, pagePath, onSave }: ContentEditDialogProps) => {
  const { uploadImage, uploading } = useCMSImages();
  const [formData, setFormData] = useState({
    section_name: '',
    content_type: 'text' as PageContent['content_type'],
    content_data: {},
    is_visible: true,
    display_order: 0,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        section_name: content.section_name,
        content_type: content.content_type,
        content_data: content.content_data,
        is_visible: content.is_visible,
        display_order: content.display_order,
      });
    } else {
      setFormData({
        section_name: '',
        content_type: 'text',
        content_data: {},
        is_visible: true,
        display_order: 0,
      });
    }
  }, [content]);

  const handleImageUpload = async (file: File, field: string) => {
    const imageUrl = await uploadImage(file, `${pagePath}/${formData.section_name}`);
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        content_data: {
          ...prev.content_data,
          [field]: imageUrl,
        },
      }));
    }
  };

  const handleSave = () => {
    onSave({
      page_path: pagePath,
      section_name: formData.section_name,
      content_type: formData.content_type,
      content_data: formData.content_data,
      is_visible: formData.is_visible,
      display_order: formData.display_order,
    });
  };

  const updateContentData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      content_data: {
        ...prev.content_data,
        [field]: value,
      },
    }));
  };

  const renderContentFields = () => {
    switch (formData.content_type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.content_data.title || ''}
                onChange={(e) => updateContentData('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.content_data.subtitle || ''}
                onChange={(e) => updateContentData('subtitle', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="background-image">Background Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="background-image"
                  value={formData.content_data.imageSrc || ''}
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
                      if (file) handleImageUpload(file, 'imageSrc');
                    }}
                  />
                </label>
              </div>
              {formData.content_data.imageSrc && (
                <div className="mt-2">
                  <img
                    src={formData.content_data.imageSrc}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={formData.content_data.text || ''}
                onChange={(e) => updateContentData('text', e.target.value)}
                rows={6}
                placeholder="Enter your text content here..."
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image-url"
                  value={formData.content_data.url || ''}
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
                      if (file) handleImageUpload(file, 'url');
                    }}
                  />
                </label>
              </div>
              {formData.content_data.url && (
                <div className="mt-2">
                  <img
                    src={formData.content_data.url}
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
                value={formData.content_data.alt || ''}
                onChange={(e) => updateContentData('alt', e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={formData.content_data.caption || ''}
                onChange={(e) => updateContentData('caption', e.target.value)}
                placeholder="Image caption"
              />
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-title">Card Title</Label>
              <Input
                id="card-title"
                value={formData.content_data.title || ''}
                onChange={(e) => updateContentData('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="card-description">Description</Label>
              <Textarea
                id="card-description"
                value={formData.content_data.description || ''}
                onChange={(e) => updateContentData('description', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="card-image">Card Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="card-image"
                  value={formData.content_data.imageSrc || ''}
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
                      if (file) handleImageUpload(file, 'imageSrc');
                    }}
                  />
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="card-link">Link URL (optional)</Label>
              <Input
                id="card-link"
                value={formData.content_data.link || ''}
                onChange={(e) => updateContentData('link', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-gray-500">Select a content type to see available fields.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {content ? 'Edit Content' : 'Create New Content'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section-name">Section Name</Label>
              <Input
                id="section-name"
                value={formData.section_name}
                onChange={(e) => setFormData(prev => ({ ...prev, section_name: e.target.value }))}
                placeholder="e.g., hero, intro, features"
              />
            </div>
            <div>
              <Label htmlFor="content-type">Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value: PageContent['content_type']) =>
                  setFormData(prev => ({ ...prev, content_type: value, content_data: {} }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero Section</SelectItem>
                  <SelectItem value="text">Text Block</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="featured">Featured Section</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="display-order">Display Order</Label>
            <Input
              id="display-order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          {renderContentFields()}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.section_name || uploading}
            >
              {uploading ? 'Uploading...' : 'Save Content'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditDialog;
