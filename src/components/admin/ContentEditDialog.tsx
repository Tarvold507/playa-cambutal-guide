
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContent } from '@/hooks/usePageContent';
import { useCMSImages } from '@/hooks/useCMSImages';
import HeroFields from './content-fields/HeroFields';
import TextFields from './content-fields/TextFields';
import ImageFields from './content-fields/ImageFields';
import CardFields from './content-fields/CardFields';

interface ContentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: PageContent | null;
  pagePath: string;
  onSave: (content: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) => void;
}

interface ContentData {
  title?: string;
  subtitle?: string;
  text?: string;
  imageSrc?: string;
  url?: string;
  alt?: string;
  caption?: string;
  description?: string;
  link?: string;
  [key: string]: any;
}

const ContentEditDialog = ({ isOpen, onClose, content, pagePath, onSave }: ContentEditDialogProps) => {
  const { uploadImage, uploading } = useCMSImages();
  const [formData, setFormData] = useState({
    section_name: '',
    content_type: 'text' as PageContent['content_type'],
    content_data: {} as ContentData,
    is_visible: true,
    display_order: 0,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        section_name: content.section_name,
        content_type: content.content_type,
        content_data: content.content_data as ContentData,
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
    const commonProps = {
      contentData: formData.content_data,
      updateContentData,
      onImageUpload: handleImageUpload,
      uploading,
    };

    switch (formData.content_type) {
      case 'hero':
        return <HeroFields {...commonProps} />;
      case 'text':
        return <TextFields contentData={formData.content_data} updateContentData={updateContentData} />;
      case 'image':
        return <ImageFields {...commonProps} />;
      case 'card':
        return <CardFields {...commonProps} />;
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
