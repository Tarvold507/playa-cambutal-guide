
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';
import PendingEventsTab from '@/components/admin/PendingEventsTab';
import PendingBusinessesTab from '@/components/admin/PendingBusinessesTab';
import AdminEditDialog from '@/components/admin/AdminEditDialog';
import { useAdminActions } from '@/hooks/useAdminActions';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const {
    pendingEvents,
    pendingBusinesses,
    isEditing,
    editForm,
    checkAdminStatus,
    fetchPendingItems,
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
    fetchPendingItems();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>
        
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">{t('admin.pendingEvents')} ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="businesses">{t('admin.pendingBusinesses')} ({pendingBusinesses.length})</TabsTrigger>
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
