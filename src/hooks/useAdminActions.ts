import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditFormData {
  type?: 'event' | 'business' | 'restaurant' | 'hotel';
  id?: string;
  title?: string;
  location?: string;
  host?: string;
  description?: string;
  name?: string;
  category?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  image_url?: string;
  hours?: Record<string, string>;
  gallery_images?: string[];
  menu_images?: string[];
  amenities?: string[];
  affiliate_url?: string;
  expedia_hotel_id?: string;
  price_from?: number;
  commission_rate?: number;
  policies?: Record<string, any>;
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
  const [pendingHotels, setPendingHotels] = useState<any[]>([]);
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
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Restaurants query result:', { restaurants, restaurantError });

      if (restaurantError) {
        console.error('Restaurant error:', restaurantError);
        setPendingRestaurants([]);
      } else if (restaurants) {
        const restaurantsWithProfiles = await Promise.all(
          restaurants.map(async (restaurant) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', restaurant.user_id)
              .single();

            return {
              ...restaurant,
              hours: typeof restaurant.hours === 'object' && restaurant.hours !== null ? 
                restaurant.hours as Record<string, string> : {},
              gallery_images: Array.isArray(restaurant.gallery_images) ? 
                restaurant.gallery_images as string[] : [],
              menu_images: Array.isArray(restaurant.menu_images) ? 
                restaurant.menu_images as string[] : [],
              profiles: profile
            };
          })
        );
        
        setPendingRestaurants(restaurantsWithProfiles);
      } else {
        setPendingRestaurants([]);
      }

      // Fetch pending hotels
      const { data: hotels, error: hotelError } = await supabase
        .from('hotel_listings')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      console.log('Hotels query result:', { hotels, hotelError });

      if (hotelError) {
        console.error('Hotel error:', hotelError);
        setPendingHotels([]);
      } else if (hotels) {
        const hotelsWithProfiles = await Promise.all(
          hotels.map(async (hotel) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', hotel.user_id)
              .single();

            return {
              ...hotel,
              gallery_images: Array.isArray(hotel.gallery_images) ? 
                hotel.gallery_images as string[] : [],
              amenities: Array.isArray(hotel.amenities) ? 
                hotel.amenities as string[] : [],
              policies: typeof hotel.policies === 'object' && hotel.policies !== null ? 
                hotel.policies as Record<string, any> : {},
              profiles: profile
            };
          })
        );
        
        setPendingHotels(hotelsWithProfiles);
      } else {
        setPendingHotels([]);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setPendingEvents([]);
      setPendingBusinesses([]);
      setPendingRestaurants([]);
      setPendingHotels([]);
    }
  };

  const handleApprove = async (type: 'events' | 'business_listings' | 'restaurant_listings' | 'hotel_listings', id: string) => {
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

  const handleReject = async (type: 'events' | 'business_listings' | 'restaurant_listings' | 'hotel_listings', id: string) => {
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

  const handleEdit = (item: any, type: 'event' | 'business' | 'restaurant' | 'hotel') => {
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
                      type === 'restaurant' ? 'restaurant_listings' :
                      'hotel_listings';

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
    pendingHotels,
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
