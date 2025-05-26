import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';
import PendingEventsTab from '@/components/admin/PendingEventsTab';
import PendingBusinessesTab from '@/components/admin/PendingBusinessesTab';
import EditItemDialog from '@/components/admin/EditItemDialog';

interface EditFormData {
  type?: 'event' | 'business';
  id?: string;
  title?: string;
  location?: string;
  host?: string;
  description?: string;
  name?: string;
  category?: string;
  address?: string;
  [key: string]: any;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({});

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

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      console.log('User role check:', userRole);

      if (!userRole || userRole.role !== 'admin') {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchPendingItems = async () => {
    try {
      console.log('Fetching pending items...');
      
      // Fetch ALL pending events - with explicit foreign key relationship
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_user_id_fkey (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      console.log('Events query result:', { events, eventsError });

      if (eventsError) {
        console.error('Events error:', eventsError);
        setPendingEvents([]);
      } else {
        setPendingEvents(events || []);
      }

      // Fetch ALL pending business listings - with explicit foreign key relationship
      const { data: businesses, error: businessError } = await supabase
        .from('business_listings')
        .select(`
          *,
          profiles!business_listings_user_id_fkey (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Businesses query result:', { businesses, businessError });

      if (businessError) {
        console.error('Business error:', businessError);
        setPendingBusinesses([]);
      } else {
        setPendingBusinesses(businesses || []);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setPendingEvents([]);
      setPendingBusinesses([]);
    }
  };

  const handleApprove = async (type: 'events' | 'business_listings', id: string) => {
    try {
      const { error } = await supabase
        .from(type)
        .update({ 
          approved: true, 
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('admin.approved'),
        description: `The ${type.slice(0, -1)} has been approved successfully.`,
      });

      fetchPendingItems();
    } catch (error) {
      console.error('Error approving item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to approve item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (type: 'events' | 'business_listings', id: string) => {
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Item rejected",
        description: `The ${type.slice(0, -1)} has been rejected and removed.`,
      });

      fetchPendingItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to reject item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any, type: 'event' | 'business') => {
    setSelectedItem(item);
    setEditForm({ ...item, type });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedItem || !editForm.type) return;

    try {
      const { type, ...updateData } = editForm;
      const { error } = await supabase
        .from(type === 'event' ? 'events' : 'business_listings')
        .update(updateData)
        .eq('id', selectedItem.id);

      if (error) throw error;

      toast({
        title: "Item updated",
        description: "The item has been updated successfully.",
      });

      setIsEditing(false);
      setSelectedItem(null);
      setEditForm({});
      fetchPendingItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (updates: Partial<EditFormData>) => {
    setEditForm(prev => ({ ...prev, ...updates }));
  };

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

        <EditItemDialog
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
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
