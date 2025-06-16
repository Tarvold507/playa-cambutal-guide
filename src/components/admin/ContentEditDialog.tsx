import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PageContent } from '@/hooks/usePageContent';
import { useCMSImages } from '@/hooks/useCMSImages';
import HeroFields from './content-fields/HeroFields';
import TextFields from './content-fields/TextFields';
import ImageFields from './content-fields/ImageFields';
import CardFields from './content-fields/CardFields';
import CardsFields from './content-fields/CardsFields';
import FeaturedFields from './content-fields/FeaturedFields';
import SectionFields from './content-fields/SectionFields';
import ServicesFields from './content-fields/ServicesFields';

interface ContentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: PageContent | null;
  pagePath: string;
  onSave: (contentData: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) => void;
}

const CONTENT_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'text', label: 'Text Content' },
  { value: 'image', label: 'Image' },
  { value: 'card', label: 'Card' },
  { value: 'cards', label: 'Cards Section' },
  { value: 'featured', label: 'Featured Section' },
  { value: 'section', label: 'General Section' },
  { value: 'services', label: 'Services Section' },
];

// Define predefined section names for each page
const PAGE_SECTIONS = {
  '/': ['hero', 'intro', 'cards', 'featured', 'newsletter'],
  '/info': ['hero', 'services', 'businesses', 'realestate', 'legal', 'transportation'],
  '/stay': ['hero', 'hotels', 'featured'],
  '/eat': ['hero', 'restaurants', 'featured'],
  '/events': ['hero', 'calendar', 'featured'],
  '/do': ['hero', 'activities', 'featured'],
  '/surf': ['hero', 'spots', 'conditions', 'lessons'],
};

const ContentEditDialog = ({ isOpen, onClose, content, pagePath, onSave }: ContentEditDialogProps) => {
  const { uploadImage, uploading } = useCMSImages();
  const [formData, setFormData] = useState({
    page_path: pagePath,
    section_name: '',
    content_type: 'text' as PageContent['content_type'],
    content_data: {},
    is_visible: true,
    display_order: 0,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        page_path: content.page_path,
        section_name: content.section_name,
        content_type: content.content_type,
        content_data: content.content_data,
        is_visible: content.is_visible,
        display_order: content.display_order,
      });
    } else {
      setFormData({
        page_path: pagePath,
        section_name: '',
        content_type: 'text',
        content_data: {},
        is_visible: true,
        display_order: 0,
      });
    }
  }, [content, pagePath]);

  const updateContentData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      content_data: {
        ...prev.content_data,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = async (file: File, field: string) => {
    const imageUrl = await uploadImage(file, 'content');
    if (imageUrl) {
      // Handle special case for card images in cards array
      if (field.includes('cards[') && field.includes('].imageSrc')) {
        const match = field.match(/cards\[(\d+)\]\.imageSrc/);
        if (match) {
          const cardIndex = parseInt(match[1]);
          const cards = (formData.content_data as any).cards || [];
          if (cards[cardIndex]) {
            const updatedCards = [...cards];
            updatedCards[cardIndex] = { ...updatedCards[cardIndex], imageSrc: imageUrl };
            updateContentData('cards', updatedCards);
          }
        }
      } else {
        // Handle regular field updates
        updateContentData(field, imageUrl);
      }
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getAvailableSections = () => {
    return PAGE_SECTIONS[pagePath as keyof typeof PAGE_SECTIONS] || ['custom'];
  };

  const renderContentFields = () => {
    switch (formData.content_type) {
      case 'hero':
        return <HeroFields contentData={formData.content_data} updateContentData={updateContentData} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'text':
        return <TextFields contentData={formData.content_data} updateContentData={updateContentData} />;
      case 'image':
        return <ImageFields contentData={formData.content_data} updateContentData={updateContentData} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'card':
        return <CardFields contentData={formData.content_data} updateContentData={updateContentData} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'cards':
        return <CardsFields contentData={formData.content_data} updateContentData={updateContentData} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'featured':
        return <FeaturedFields contentData={formData.content_data} updateContentData={updateContentData} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'section':
        return <SectionFields contentData={formData.content_data} updateContentData={updateContentData} />;
      case 'services':
        return <ServicesFields contentData={formData.content_data} updateContentData={updateContentData} />;
      default:
        return <div className="text-gray-500">Select a content type to see available fields.</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {content ? 'Edit Content' : 'Create New Content'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section-name">Section Name</Label>
              <Select
                value={formData.section_name}
                onValueChange={(value) => setFormData(prev => ({ ...prev, section_name: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSections().map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {formData.section_name === 'custom' && (
                <Input
                  className="mt-2"
                  placeholder="Enter custom section name"
                  value={formData.section_name === 'custom' ? '' : formData.section_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_name: e.target.value }))}
                />
              )}
            </div>

            <div>
              <Label htmlFor="content-type">Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  content_type: value as PageContent['content_type'],
                  content_data: {} // Reset content data when type changes
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display-order">Display Order</Label>
              <Input
                id="display-order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
              />
              <Label htmlFor="is-visible">Visible</Label>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Content Fields</h3>
            {renderContentFields()}
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {content ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditDialog;
