
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePageContent, PageContent } from '@/hooks/usePageContent';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import ContentEditDialog from './ContentEditDialog';

const AVAILABLE_PAGES = [
  { path: '/', name: 'Home Page' },
  { path: '/stay', name: 'Stay Page' },
  { path: '/eat', name: 'Eat Page' },
  { path: '/events', name: 'Events Page' },
  { path: '/do', name: 'Do Page' },
  { path: '/surf', name: 'Surf Page' },
  { path: '/info', name: 'Info Page' },
];

const ContentManagementTab = () => {
  const {
    pageContent,
    loading,
    fetchPageContent,
    createPageContent,
    updatePageContent,
    deletePageContent,
    toggleContentVisibility,
  } = usePageContent();

  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PageContent | null>(null);

  const filteredContent = pageContent.filter(content => content.page_path === selectedPage);

  const handleCreateContent = () => {
    setEditingContent(null);
    setIsEditDialogOpen(true);
  };

  const handleEditContent = (content: PageContent) => {
    setEditingContent(content);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await deletePageContent(id);
    }
  };

  const handleToggleVisibility = async (content: PageContent) => {
    await toggleContentVisibility(content.id, !content.is_visible);
  };

  const handleSaveContent = async (contentData: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingContent) {
        await updatePageContent(editingContent.id, contentData);
      } else {
        await createPageContent({
          ...contentData,
          page_path: selectedPage,
        });
      }
      setIsEditDialogOpen(false);
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-purple-100 text-purple-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-orange-100 text-orange-800';
      case 'featured': return 'bg-red-100 text-red-800';
      case 'services': return 'bg-teal-100 text-teal-800';
      case 'section': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venao mx-auto mb-2"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-gray-600">Manage images, text, and sections for each page</p>
        </div>
        <Button onClick={handleCreateContent} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Content
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Select Page:</label>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_PAGES.map((page) => (
              <SelectItem key={page.path} value={page.path}>
                {page.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <p>No content found for this page.</p>
              <p className="text-sm mt-2">Click "Add Content" to create the first content block.</p>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((content) => (
            <Card key={content.id} className={`${!content.is_visible ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{content.section_name}</CardTitle>
                        <Badge className={getContentTypeColor(content.content_type)}>
                          {content.content_type}
                        </Badge>
                        {!content.is_visible && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Hidden
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        Order: {content.display_order} • 
                        Updated: {new Date(content.updated_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {content.is_visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-600" />
                      )}
                      <Switch
                        checked={content.is_visible}
                        onCheckedChange={() => handleToggleVisibility(content)}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditContent(content)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContent(content.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {content.content_type === 'hero' && (
                    <div>
                      <p><strong>Title:</strong> {content.content_data.title || 'Not set'}</p>
                      <p><strong>Subtitle:</strong> {content.content_data.subtitle || 'Not set'}</p>
                      <p><strong>Background Image:</strong> {content.content_data.imageSrc ? 'Set' : 'Not set'}</p>
                    </div>
                  )}
                  {content.content_type === 'text' && (
                    <div>
                      <p><strong>Content:</strong> {content.content_data.text ? content.content_data.text.substring(0, 100) + '...' : 'Not set'}</p>
                    </div>
                  )}
                  {content.content_type === 'image' && (
                    <div>
                      <p><strong>Image URL:</strong> {content.content_data.url ? 'Set' : 'Not set'}</p>
                      <p><strong>Alt Text:</strong> {content.content_data.alt || 'Not set'}</p>
                    </div>
                  )}
                  {content.content_type === 'services' && (
                    <div>
                      <p><strong>Title:</strong> {content.content_data.title || 'Not set'}</p>
                      <p><strong>Services:</strong> {content.content_data.services ? `${content.content_data.services.length} service(s)` : 'Not set'}</p>
                      {content.content_data.services && content.content_data.services.length > 0 && (
                        <p><strong>First service:</strong> {content.content_data.services[0].name}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ContentEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingContent(null);
        }}
        content={editingContent}
        pagePath={selectedPage}
        onSave={handleSaveContent}
      />
    </div>
  );
};

export default ContentManagementTab;
