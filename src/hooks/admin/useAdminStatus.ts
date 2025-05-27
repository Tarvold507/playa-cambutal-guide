
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return { checkAdminStatus };
};
