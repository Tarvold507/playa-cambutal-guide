
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditFormData {
  type?: 'event' | 'business' | 'restaurant';
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

export const useAdminActions = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({});

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
      
      // Fetch pending events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_user_id_fkey (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      console.log('Pending events query result:', { events, eventsError });

      if (eventsError) {
        console.error('Events error:', eventsError);
        setPendingEvents([]);
      } else {
        setPendingEvents(events || []);
      }

      // Fetch pending businesses
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

      // Fetch pending restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurant_listings')
        .select(`
          *,
          profiles!restaurant_listings_user_id_fkey (name, email)
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Restaurants query result:', { restaurants, restaurantError });

      if (restaurantError) {
        console.error('Restaurant error:', restaurantError);
        setPendingRestaurants([]);
      } else {
        setPendingRestaurants(restaurants || []);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setPendingEvents([]);
      setPendingBusinesses([]);
      setPendingRestaurants([]);
    }
  };

  const handleApprove = async (type: 'events' | 'business_listings' | 'restaurant_listings', id: string) => {
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

  const handleReject = async (type: 'events' | 'business_listings' | 'restaurant_listings', id: string) => {
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

  const handleEdit = (item: any, type: 'event' | 'business' | 'restaurant') => {
    setSelectedItem(item);
    setEditForm({ ...item, type });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedItem || !editForm.type) return;

    try {
      const { type, profiles, ...updateData } = editForm;
      
      const fieldsToExclude = ['profiles', 'id', 'created_at', 'updated_at', 'approved_by', 'approved_at'];
      const cleanUpdateData = Object.keys(updateData).reduce((acc, key) => {
        if (!fieldsToExclude.includes(key)) {
          acc[key] = updateData[key];
        }
        return acc;
      }, {} as any);

      console.log('Updating with clean data:', cleanUpdateData);

      const tableName = type === 'event' ? 'events' : 
                      type === 'business' ? 'business_listings' : 
                      'restaurant_listings';

      const { error } = await supabase
        .from(tableName)
        .update(cleanUpdateData)
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

  const closeEditDialog = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setEditForm({});
  };

  return {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    selectedItem,
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
  };
};
