
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  approved: boolean;
  approved_by?: string;
  approved_at?: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBlogPosts = async (includeUnpublished = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('status', 'published').eq('approved', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Type the data properly to match BlogPost interface
      const typedData = (data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'published' | 'archived',
        profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
      }));
      
      setBlogPosts(typedData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch blog posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_user_id_fkey (
            name,
            email
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('approved', true)
        .single();

      if (error) throw error;
      
      // Type the data properly
      return {
        ...data,
        status: data.status as 'draft' | 'published' | 'archived',
        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  };

  const createBlogPost = async (postData: Partial<BlogPost>) => {
    if (!user) return;

    try {
      // Remove fields that shouldn't be in the insert
      const { profiles, id, created_at, updated_at, approved_by, approved_at, ...cleanPostData } = postData;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...cleanPostData,
          user_id: user.id,
          title: cleanPostData.title || '',
          slug: cleanPostData.slug || '',
          content: cleanPostData.content || '',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });

      return {
        ...data,
        status: data.status as 'draft' | 'published' | 'archived'
      };
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog post',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return {
    blogPosts,
    loading,
    fetchBlogPosts,
    fetchBlogPostBySlug,
    createBlogPost,
  };
};
