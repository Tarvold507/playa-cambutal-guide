
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogPosts';

interface PendingBlogPostsTabProps {
  pendingBlogPosts: BlogPost[];
  isLoading?: boolean;
  error?: string | null;
  onApprove: (id: string) => void;
  onEdit: (post: BlogPost) => void;
  onReject: (id: string) => void;
  onRefresh?: () => void;
}

const PendingBlogPostsTab = ({ 
  pendingBlogPosts, 
  isLoading = false,
  error = null,
  onApprove, 
  onEdit, 
  onReject,
  onRefresh
}: PendingBlogPostsTabProps) => {
  console.log('🎨 PendingBlogPostsTab rendering with:', {
    pendingBlogPostsCount: pendingBlogPosts.length,
    isLoading,
    error,
    posts: pendingBlogPosts
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <p className="font-semibold">Error loading blog posts:</p>
          <p className="text-sm">{error}</p>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading blog posts...</p>
      </div>
    );
  }

  if (pendingBlogPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No pending blog posts to review.</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {pendingBlogPosts.length} pending blog post{pendingBlogPosts.length !== 1 ? 's' : ''}
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
      
      {pendingBlogPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.profiles?.name || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(post)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApprove(post.id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {post.excerpt && (
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
            )}
            
            <div className="flex gap-2 flex-wrap mb-4">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            {post.featured_image_url && (
              <div className="aspect-video w-full max-w-sm overflow-hidden rounded-lg">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingBlogPostsTab;
