
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
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingBlogPosts(data || []);
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
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLiveBlogPosts(data || []);
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
