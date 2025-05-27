
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import type { TableType, ItemType } from './types';

export const useAdminItemActions = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleApprove = async (type: TableType, id: string, onRefresh: () => void) => {
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

      onRefresh();
    } catch (error) {
      console.error('Error approving item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to approve item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (type: TableType, id: string, onRefresh: () => void) => {
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

      onRefresh();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast({
        title: t('common.error'),
        description: "Failed to reject item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleApprove,
    handleReject,
  };
};
