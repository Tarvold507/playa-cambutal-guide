
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs } from "@/components/ui/tabs";
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsNavigation from '@/components/admin/AdminTabsNavigation';
import AdminTabsContent from '@/components/admin/AdminTabsContent';
import AdminEditDialog from '@/components/admin/AdminEditDialog';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useAdminBlogData } from '@/hooks/admin/useAdminBlogData';
import { useAdminSEOData } from '@/hooks/admin/useAdminSEOData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    pendingAdventureBusinesses,
    liveHotels,
    liveRestaurants,
    liveAdventureBusinesses,
    isEditing,
    editForm,
    checkAdminStatus,
    refreshAllData,
    handleApprove,
    handleReject,
    handleEdit,
    handleSaveEdit,
    handleFormChange,
    closeEditDialog,
  } = useAdminActions();

  const {
    pendingBlogPosts,
    liveBlogPosts,
    isLoading: blogLoading,
    error: blogError,
    fetchPendingBlogPosts,
    fetchLiveBlogPosts,
    refreshBlogData,
  } = useAdminBlogData();

  const {
    pageSEO,
    refreshSEOData,
  } = useAdminSEOData();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    checkAdminStatus();
  }, [user, navigate]);

  useEffect(() => {
    console.log('🔄 AdminDashboard mounted, refreshing all data...');
    refreshAllData();
    // Blog data is fetched by useAdminBlogData hook automatically
  }, []);

  const handleBlogApprove = async (id: string) => {
    console.log('✅ Approving blog post:', id);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          approved: true, 
          status: 'published',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Blog post approved",
        description: "The blog post has been approved and published successfully.",
      });

      refreshBlogData();
    } catch (error) {
      console.error('Error approving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to approve blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBlogReject = async (id: string) => {
    console.log('❌ Rejecting blog post:', id);
    await handleReject('blog_posts', id);
    refreshBlogData();
  };

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    refreshAllData();
    refreshBlogData();
  };

  const handleSaveEditWithRefresh = () => {
    console.log('💾 Saving edit with refresh...');
    handleSaveEdit();
    setTimeout(() => {
      console.log('🔄 Additional refresh after save...');
      refreshAllData();
      refreshBlogData();
    }, 1000);
  };

  if (!user) return null;

  const pendingCounts = {
    events: pendingEvents.length,
    businesses: pendingBusinesses.length,
    restaurants: pendingRestaurants.length,
    hotels: pendingHotels.length,
    adventure: pendingAdventureBusinesses.length,
    blog: pendingBlogPosts.length,
  };

  const liveCounts = {
    hotels: liveHotels.length,
    restaurants: liveRestaurants.length,
    adventure: liveAdventureBusinesses.length,
    seo: pageSEO.length,
  };

  const adminData = {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    pendingAdventureBusinesses,
    pendingBlogPosts,
    liveHotels,
    liveRestaurants,
    liveAdventureBusinesses,
    pageSEO,
  };

  const adminHandlers = {
    handleApprove,
    handleReject,
    handleEdit,
    handleBlogApprove,
    handleBlogReject,
    refreshSEOData,
  };

  const blogDataProps = {
    isLoading: blogLoading,
    error: blogError,
    refreshBlogData,
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <AdminHeader onRefresh={handleManualRefresh} />
        
        <Tabs defaultValue="events" className="w-full">
          <AdminTabsNavigation 
            pendingCounts={pendingCounts}
            liveCounts={liveCounts}
          />
          
          <AdminTabsContent 
            data={adminData}
            handlers={adminHandlers}
            blogData={blogDataProps}
          />
        </Tabs>

        <AdminEditDialog
          isOpen={isEditing}
          onClose={closeEditDialog}
          editForm={editForm}
          onFormChange={handleFormChange}
          onSave={handleSaveEditWithRefresh}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
