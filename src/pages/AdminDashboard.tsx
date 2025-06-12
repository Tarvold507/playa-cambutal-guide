
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PendingEventsTab from '@/components/admin/PendingEventsTab';
import PendingBusinessesTab from '@/components/admin/PendingBusinessesTab';
import PendingRestaurantsTab from '@/components/admin/PendingRestaurantsTab';
import PendingHotelsTab from '@/components/admin/PendingHotelsTab';
import PendingBlogPostsTab from '@/components/admin/PendingBlogPostsTab';
import PendingAdventureBusinessesTab from '@/components/admin/PendingAdventureBusinessesTab';
import LiveHotelsTab from '@/components/admin/LiveHotelsTab';
import LiveRestaurantsTab from '@/components/admin/LiveRestaurantsTab';
import LiveAdventureBusinessesTab from '@/components/admin/LiveAdventureBusinessesTab';
import SEOManagementTab from '@/components/admin/SEOManagementTab';
import ContentManagementTab from '@/components/admin/ContentManagementTab';
import GooglePlacesImport from '@/components/admin/GooglePlacesImport';
import AdminEditDialog from '@/components/admin/AdminEditDialog';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useAdminBlogData } from '@/hooks/admin/useAdminBlogData';
import { useAdminSEOData } from '@/hooks/admin/useAdminSEOData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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
    fetchPendingBlogPosts,
    fetchLiveBlogPosts,
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
    refreshAllData();
    fetchPendingBlogPosts();
    fetchLiveBlogPosts();
  }, []);

  const refreshBlogData = () => {
    fetchPendingBlogPosts();
    fetchLiveBlogPosts();
  };

  const handleBlogApprove = async (id: string) => {
    await handleApprove('blog_posts', id);
    refreshBlogData();
  };

  const handleBlogReject = async (id: string) => {
    await handleReject('blog_posts', id);
    refreshBlogData();
  };

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    refreshAllData();
    refreshBlogData();
  };

  // Enhanced save handler that ensures refresh
  const handleSaveEditWithRefresh = () => {
    console.log('💾 Saving edit with refresh...');
    handleSaveEdit(() => {
      console.log('🔄 Refreshing all data after save...');
      refreshAllData();
      refreshBlogData();
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <Button onClick={handleManualRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        
        <Tabs defaultValue="events" className="w-full">
          <div className="space-y-2">
            <TabsList className="grid w-full grid-cols-6 h-auto">
              <TabsTrigger value="events" className="text-sm">{t('admin.pendingEvents')} ({pendingEvents.length})</TabsTrigger>
              <TabsTrigger value="businesses" className="text-sm">{t('admin.pendingBusinesses')} ({pendingBusinesses.length})</TabsTrigger>
              <TabsTrigger value="restaurants" className="text-sm">Restaurants ({pendingRestaurants.length})</TabsTrigger>
              <TabsTrigger value="hotels" className="text-sm">Hotels ({pendingHotels.length})</TabsTrigger>
              <TabsTrigger value="adventure" className="text-sm">Adventure ({pendingAdventureBusinesses.length})</TabsTrigger>
              <TabsTrigger value="blog" className="text-sm">Blog ({pendingBlogPosts.length})</TabsTrigger>
            </TabsList>
            
            <TabsList className="grid w-full grid-cols-6 h-auto">
              <TabsTrigger value="live-hotels" className="text-sm">Live Hotels ({liveHotels.length})</TabsTrigger>
              <TabsTrigger value="live-restaurants" className="text-sm">Live Restaurants ({liveRestaurants.length})</TabsTrigger>
              <TabsTrigger value="live-adventure" className="text-sm">Live Adventure ({liveAdventureBusinesses.length})</TabsTrigger>
              <TabsTrigger value="seo" className="text-sm">SEO ({pageSEO.length})</TabsTrigger>
              <TabsTrigger value="content" className="text-sm">Content</TabsTrigger>
              <TabsTrigger value="import" className="text-sm">Import</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="mt-6">
            <TabsContent value="events">
              <PendingEventsTab
                pendingEvents={pendingEvents}
                onApprove={(id) => handleApprove('events', id)}
                onEdit={(item) => handleEdit(item, 'event')}
                onReject={(id) => handleReject('events', id)}
              />
            </TabsContent>
            
            <TabsContent value="businesses">
              <PendingBusinessesTab
                pendingBusinesses={pendingBusinesses}
                onApprove={(id) => handleApprove('business_listings', id)}
                onEdit={(item) => handleEdit(item, 'business')}
                onReject={(id) => handleReject('business_listings', id)}
              />
            </TabsContent>

            <TabsContent value="restaurants">
              <PendingRestaurantsTab
                pendingRestaurants={pendingRestaurants}
                onApprove={(id) => handleApprove('restaurant_listings', id)}
                onEdit={(item) => handleEdit(item, 'restaurant')}
                onReject={(id) => handleReject('restaurant_listings', id)}
              />
            </TabsContent>

            <TabsContent value="hotels">
              <PendingHotelsTab
                pendingHotels={pendingHotels}
                onApprove={(id) => handleApprove('hotel_listings', id)}
                onEdit={(item) => handleEdit(item, 'hotel')}
                onReject={(id) => handleReject('hotel_listings', id)}
              />
            </TabsContent>

            <TabsContent value="adventure">
              <PendingAdventureBusinessesTab
                pendingAdventureBusinesses={pendingAdventureBusinesses}
                onApprove={(id) => handleApprove('adventure_business_listings', id)}
                onEdit={(item) => handleEdit(item, 'adventure')}
                onReject={(id) => handleReject('adventure_business_listings', id)}
              />
            </TabsContent>

            <TabsContent value="blog">
              <PendingBlogPostsTab
                pendingBlogPosts={pendingBlogPosts}
                onApprove={handleBlogApprove}
                onEdit={(item) => handleEdit(item, 'blog')}
                onReject={handleBlogReject}
              />
            </TabsContent>

            <TabsContent value="live-hotels">
              <LiveHotelsTab
                liveHotels={liveHotels}
                onEdit={(item) => handleEdit(item, 'hotel')}
              />
            </TabsContent>

            <TabsContent value="live-restaurants">
              <LiveRestaurantsTab
                liveRestaurants={liveRestaurants}
                onEdit={(item) => handleEdit(item, 'restaurant')}
              />
            </TabsContent>

            <TabsContent value="live-adventure">
              <LiveAdventureBusinessesTab
                liveAdventureBusinesses={liveAdventureBusinesses}
                onEdit={(item) => handleEdit(item, 'adventure')}
              />
            </TabsContent>

            <TabsContent value="seo">
              <SEOManagementTab
                pageSEO={pageSEO}
                onRefresh={refreshSEOData}
              />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagementTab />
            </TabsContent>

            <TabsContent value="import">
              <div className="space-y-6">
                <GooglePlacesImport />
              </div>
            </TabsContent>
          </div>
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
