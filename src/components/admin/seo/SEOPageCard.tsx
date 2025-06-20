
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X } from 'lucide-react';
import { PageSEO } from '@/hooks/usePageSEO';
import { SEOEditForm } from './SEOEditForm';

interface SEOPageCardProps {
  page: PageSEO;
  onSave: (page: PageSEO, formData: Partial<PageSEO>) => Promise<void>;
}

const SEOPageCard = ({ page, onSave }: SEOPageCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PageSEO>>({});

  const getPageType = (pagePath: string) => {
    if (pagePath.startsWith('/stay/')) return 'hotel';
    if (pagePath.startsWith('/eat/') && pagePath !== '/eat') return 'restaurant';
    if (pagePath.startsWith('/events/')) return 'event';
    if (pagePath.startsWith('/blog/')) return 'blog';
    return 'static';
  };

  const getPageTypeColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'bg-blue-100 text-blue-800';
      case 'restaurant': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'blog': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(page);
  };

  const handleSave = async () => {
    await onSave(page, editForm);
    setIsEditing(false);
    setEditForm({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const pageType = getPageType(page.page_path);
  const isCustom = page.meta_keywords?.includes('custom');
  const hasCorrectDomain = page.canonical_url?.includes('playacambutalguide.com');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{page.page_path}</CardTitle>
              <Badge className={getPageTypeColor(pageType)}>
                {pageType}
              </Badge>
              {isCustom && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Custom
                </Badge>
              )}
              {!hasCorrectDomain && (
                <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                  Domain Fix Needed
                </Badge>
              )}
            </div>
            <CardDescription>{page.page_title}</CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <SEOEditForm 
            formData={editForm} 
            onChange={setEditForm}
          />
        ) : (
          <div className="space-y-2">
            <p><strong>Meta Description:</strong> {page.meta_description || 'Not set'}</p>
            <p><strong>Meta Keywords:</strong> {page.meta_keywords || 'Not set'}</p>
            <p><strong>Open Graph Title:</strong> {page.og_title || 'Not set'}</p>
            <p><strong>Canonical URL:</strong> {page.canonical_url || 'Not set'}</p>
            <p className="text-sm text-gray-500">
              <strong>Last Updated:</strong> {new Date(page.updated_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOPageCard;
