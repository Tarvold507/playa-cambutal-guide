
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { useBlogPostSEO } from '../hooks/useBlogPostSEO';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Use the SEO hook
  useBlogPostSEO(post);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, profiles(name)')
          .eq('slug', slug)
          .eq('approved', true)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          navigate('/blog');
          return;
        }

        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            {post.featured_image_url && (
              <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
              
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                </div>
                {post.profiles?.name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.profiles.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {post.category && (
                  <Badge variant="secondary">{post.category}</Badge>
                )}
                {post.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </header>

            {post.excerpt && (
              <div className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                {post.excerpt}
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default BlogPost;
