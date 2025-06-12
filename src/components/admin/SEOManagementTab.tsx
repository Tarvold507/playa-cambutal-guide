import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePageSEO, PageSEO } from '@/hooks/usePageSEO';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X, RefreshCw } from 'lucide-react';

interface SEOManagementTabProps {
  pageSEO: PageSEO[];
  onRefresh: () => void;
}

const SEOManagementTab = ({ pageSEO, onRefresh }: SEOManagementTabProps) => {
  const { updatePageSEO } = usePageSEO();
  const { toast } = useToast();
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PageSEO>>({});
  const [filterType, setFilterType] = useState<string>('all');

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

  const filteredPages = pageSEO.filter(page => {
    if (filterType === 'all') return true;
    return getPageType(page.page_path) === filterType;
  });

  const handleEdit = (page: PageSEO) => {
    setEditingPage(page.id);
    setEditForm(page);
  };

  const handleSave = async () => {
    if (!editingPage || !editForm.page_path) return;

    try {
      // Add 'custom' to meta_keywords to indicate this is manually edited
      const updatedForm = {
        ...editForm,
        meta_keywords: editForm.meta_keywords?.includes('custom') 
          ? editForm.meta_keywords 
          : `${editForm.meta_keywords || ''}, custom`.replace(/^, /, '')
      };

      await updatePageSEO(editForm.page_path, updatedForm);
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

  const handleBulkRefresh = async () => {
    toast({
      title: 'Refreshing SEO Data',
      description: 'This will regenerate SEO for all dynamic pages when they are next visited.',
    });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Label htmlFor="filter">Filter by type:</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="static">Static Pages</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="blog">Blog Posts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleBulkRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {filteredPages.map((page) => {
        const pageType = getPageType(page.page_path);
        const isCustom = page.meta_keywords?.includes('custom');
        
        return (
          <Card key={page.id}>
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
                  </div>
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
                  <p className="text-sm text-gray-500">
                    <strong>Last Updated:</strong> {new Date(page.updated_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {filteredPages.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p>No pages found for the selected filter.</p>
            <p className="text-sm mt-2">Dynamic pages will appear here after they are visited by users.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SEOManagementTab;
