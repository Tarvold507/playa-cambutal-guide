
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNewsletterUnsubscribe = () => {
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const { toast } = useToast();

  const unsubscribe = async (token: string) => {
    setIsUnsubscribing(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ status: 'unsubscribed' })
        .eq('unsubscribe_token', token);

      if (error) {
        throw error;
      }

      toast({
        title: "Successfully unsubscribed",
        description: "You have been unsubscribed from our newsletter.",
        variant: "default",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      toast({
        title: "Unsubscribe failed",
        description: "There was an error unsubscribing. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return {
    unsubscribe,
    isUnsubscribing
  };
};
