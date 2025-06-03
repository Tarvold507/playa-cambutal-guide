
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/hooks/useBlogPosts';

export const useAdminBlogData = () => {
  const [pendingBlogPosts, setPendingBlogPosts] = useState<BlogPost[]>([]);
  const [liveBlogPosts, setLiveBlogPosts] = useState<BlogPost[]>([]);

  const fetchPendingBlogPosts = async () => {
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
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type the data properly to match BlogPost interface
      const typedData = (data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'published' | 'archived',
        profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
      }));
      
      setPendingBlogPosts(typedData);
    } catch (error) {
      console.error('Error fetching pending blog posts:', error);
    }
  };

  const fetchLiveBlogPosts = async () => {
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
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type the data properly to match BlogPost interface
      const typedData = (data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'published' | 'archived',
        profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
      }));
      
      setLiveBlogPosts(typedData);
    } catch (error) {
      console.error('Error fetching live blog posts:', error);
    }
  };

  useEffect(() => {
    fetchPendingBlogPosts();
    fetchLiveBlogPosts();
  }, []);

  return {
    pendingBlogPosts,
    liveBlogPosts,
    fetchPendingBlogPosts,
    fetchLiveBlogPosts,
  };
};
