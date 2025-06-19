
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/hooks/useBlogPosts';

export const useAdminBlogData = () => {
  const [pendingBlogPosts, setPendingBlogPosts] = useState<BlogPost[]>([]);
  const [liveBlogPosts, setLiveBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingBlogPosts = async () => {
    console.log('🔍 Fetching pending blog posts...');
    setIsLoading(true);
    setError(null);
    
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

      if (error) {
        console.error('❌ Error fetching pending blog posts:', error);
        setError(`Failed to fetch pending blog posts: ${error.message}`);
        throw error;
      }
      
      console.log('✅ Fetched pending blog posts:', data?.length || 0, 'posts');
      console.log('📋 Posts data:', data);
      
      // Type the data properly to match BlogPost interface
      const typedData = (data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'published' | 'archived',
        profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
      }));
      
      setPendingBlogPosts(typedData);
    } catch (error: any) {
      console.error('❌ Error fetching pending blog posts:', error);
      setError(error?.message || 'Failed to fetch pending blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLiveBlogPosts = async () => {
    console.log('🔍 Fetching live blog posts...');
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
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching live blog posts:', error);
        throw error;
      }
      
      console.log('✅ Fetched live blog posts:', data?.length || 0, 'posts');
      
      // Type the data properly to match BlogPost interface
      const typedData = (data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'published' | 'archived',
        profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
      }));
      
      setLiveBlogPosts(typedData);
    } catch (error: any) {
      console.error('❌ Error fetching live blog posts:', error);
    }
  };

  const refreshBlogData = () => {
    console.log('🔄 Manual refresh of blog data triggered');
    fetchPendingBlogPosts();
    fetchLiveBlogPosts();
  };

  useEffect(() => {
    console.log('🚀 useAdminBlogData hook mounted, fetching initial data...');
    fetchPendingBlogPosts();
    fetchLiveBlogPosts();
  }, []);

  return {
    pendingBlogPosts,
    liveBlogPosts,
    isLoading,
    error,
    fetchPendingBlogPosts,
    fetchLiveBlogPosts,
    refreshBlogData,
  };
};
