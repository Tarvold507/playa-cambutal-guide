
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Edit, RefreshCw } from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogPosts';

interface LiveBlogPostsTabProps {
  liveBlogPosts: BlogPost[];
  onEdit: (post: BlogPost, type: string) => void;
  onRefresh?: () => void;
}

const LiveBlogPostsTab = ({ 
  liveBlogPosts, 
  onEdit,
  onRefresh
}: LiveBlogPostsTabProps) => {
  console.log('🎨 LiveBlogPostsTab rendering with:', {
    liveBlogPostsCount: liveBlogPosts.length,
    posts: liveBlogPosts
  });

  if (liveBlogPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No live blog posts found.</p>
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
          {liveBlogPosts.length} live blog post{liveBlogPosts.length !== 1 ? 's' : ''}
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
      
      {liveBlogPosts.map((post) => (
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
                    <Badge variant="default">
                      {post.status}
                    </Badge>
                    {post.approved && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Approved
                      </Badge>
                    )}
                  </div>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(post, 'blog')}
                >
                  <Edit className="w-4 h-4" />
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

export default LiveBlogPostsTab;
