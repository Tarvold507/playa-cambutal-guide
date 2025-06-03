
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import type { EditFormData, ItemType } from './types';

export const useAdminEdit = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({});

  const handleEdit = (item: any, type: ItemType) => {
    setSelectedItem(item);
    setEditForm({ ...item, type });
    setIsEditing(true);
  };

  const handleSaveEdit = async (onRefresh: () => void) => {
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
                      type === 'hotel' ? 'hotel_listings' :
                      'blog_posts';

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
      onRefresh();
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
    selectedItem,
    isEditing,
    editForm,
    handleEdit,
    handleSaveEdit,
    handleFormChange,
    closeEditDialog,
  };
};
