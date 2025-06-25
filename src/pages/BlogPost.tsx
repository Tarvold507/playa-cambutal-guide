import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBlogPosts, BlogPost } from '../hooks/useBlogPosts';
import { updatePageHead, generateBlogSchema } from '../utils/seoUtils';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { fetchBlogPostBySlug } = useBlogPosts();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadPost = async () => {
      if (!slug) {
        setError('No blog post slug provided');
        setLoading(false);
        return;
      }
      
      console.log('🚀 BlogPostPage loading post with slug:', slug);
      setLoading(true);
      setError(null);
      
      try {
        const postData = await fetchBlogPostBySlug(slug);
        
        if (postData) {
          console.log('✅ BlogPostPage loaded post:', postData.title);
          setPost(postData);
          
          // Update SEO
          const seoData = {
            page_title: postData.seo_title || postData.title,
            meta_description: postData.seo_description || postData.excerpt,
            meta_keywords: postData.seo_keywords,
            og_title: postData.title,
            og_description: postData.excerpt || postData.seo_description,
            og_image: postData.featured_image_url,
            twitter_title: postData.title,
            twitter_description: postData.excerpt || postData.seo_description,
            twitter_image: postData.featured_image_url,
            canonical_url: `${window.location.origin}/blog/${postData.slug}`,
            schema_markup: generateBlogSchema(postData)
          };
          
          updatePageHead(seoData as any);
        } else {
          console.log('❌ BlogPostPage: No post found for slug:', slug);
          setError('Blog post not found or not yet approved for publication');
        }
      } catch (err) {
        console.error('❌ BlogPostPage error loading post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [slug]); // Removed fetchBlogPostBySlug from dependencies to prevent infinite loop

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Blog Post Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {error === 'Blog post not found or not yet approved for publication' 
                ? 'This blog post may not be published yet or is still waiting for approval.'
                : 'The blog post you\'re looking for doesn\'t exist or failed to load.'
              }
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to blog link */}
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          {/* Featured image */}
          {post.featured_image_url && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Article header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {post.profiles?.name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.profiles.name}
                </div>
              )}
            </div>
            
            {/* Tags and category */}
            <div className="flex gap-2 flex-wrap">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 mt-6 italic border-l-4 border-blue-500 pl-4">
                {post.excerpt}
              </p>
            )}
          </header>
          
          {/* Article content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
