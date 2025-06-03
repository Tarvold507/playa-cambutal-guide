
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePageSEO, PageSEO } from '@/hooks/usePageSEO';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X } from 'lucide-react';

interface SEOManagementTabProps {
  pageSEO: PageSEO[];
  onRefresh: () => void;
}

const SEOManagementTab = ({ pageSEO, onRefresh }: SEOManagementTabProps) => {
  const { updatePageSEO } = usePageSEO();
  const { toast } = useToast();
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PageSEO>>({});

  const handleEdit = (page: PageSEO) => {
    setEditingPage(page.id);
    setEditForm(page);
  };

  const handleSave = async () => {
    if (!editingPage || !editForm.page_path) return;

    try {
      await updatePageSEO(editForm.page_path, editForm);
      toast({
        title: 'Success',
        description: 'SEO settings updated successfully',
      });
      setEditingPage(null);
      setEditForm({});
      onRefresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setEditForm({});
  };

  return (
    <div className="space-y-4">
      {pageSEO.map((page) => (
        <Card key={page.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{page.page_path}</CardTitle>
                <CardDescription>{page.page_title}</CardDescription>
              </div>
              <div className="flex gap-2">
                {editingPage === page.id ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingPage === page.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page_title">Page Title</Label>
                  <Input
                    id="page_title"
                    value={editForm.page_title || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, page_title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={editForm.meta_description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={editForm.meta_keywords || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="og_title">Open Graph Title</Label>
                    <Input
                      id="og_title"
                      value={editForm.og_title || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, og_title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="og_image">Open Graph Image</Label>
                    <Input
                      id="og_image"
                      value={editForm.og_image || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, og_image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="og_description">Open Graph Description</Label>
                  <Textarea
                    id="og_description"
                    value={editForm.og_description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, og_description: e.target.value }))}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={editForm.canonical_url || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="https://playacambutal.guide/page"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Meta Description:</strong> {page.meta_description || 'Not set'}</p>
                <p><strong>Meta Keywords:</strong> {page.meta_keywords || 'Not set'}</p>
                <p><strong>Open Graph Title:</strong> {page.og_title || 'Not set'}</p>
                <p><strong>Canonical URL:</strong> {page.canonical_url || 'Not set'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SEOManagementTab;
