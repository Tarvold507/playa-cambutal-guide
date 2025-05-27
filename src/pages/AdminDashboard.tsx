
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';
import PendingEventsTab from '@/components/admin/PendingEventsTab';
import PendingBusinessesTab from '@/components/admin/PendingBusinessesTab';
import PendingRestaurantsTab from '@/components/admin/PendingRestaurantsTab';
import PendingHotelsTab from '@/components/admin/PendingHotelsTab';
import LiveHotelsTab from '@/components/admin/LiveHotelsTab';
import AdminEditDialog from '@/components/admin/AdminEditDialog';
import { useAdminActions } from '@/hooks/useAdminActions';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    liveHotels,
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

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkAdminStatus();
  }, [user, navigate]);

  useEffect(() => {
    refreshAllData();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>
        
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="events">{t('admin.pendingEvents')} ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="businesses">{t('admin.pendingBusinesses')} ({pendingBusinesses.length})</TabsTrigger>
            <TabsTrigger value="restaurants">Pending Restaurants ({pendingRestaurants.length})</TabsTrigger>
            <TabsTrigger value="hotels">Pending Hotels ({pendingHotels.length})</TabsTrigger>
            <TabsTrigger value="live-hotels">Live Hotels ({liveHotels.length})</TabsTrigger>
          </TabsList>
          
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

          <TabsContent value="live-hotels">
            <LiveHotelsTab
              liveHotels={liveHotels}
              onEdit={(item) => handleEdit(item, 'hotel')}
            />
          </TabsContent>
        </Tabs>

        <AdminEditDialog
          isOpen={isEditing}
          onClose={closeEditDialog}
          editForm={editForm}
          onFormChange={handleFormChange}
          onSave={handleSaveEdit}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
