
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { translations } from '@/translations';
import { TranslationKey } from '@/translations';

type Language = 'en' | 'es';

export const useDynamicTranslations = (language: Language) => {
  return useQuery({
    queryKey: ['dynamic-translations', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('translation_key, value')
        .eq('language', language);

      if (error) throw error;

      // Create a map of database translations
      const dbTranslations: Record<string, string> = {};
      data.forEach(item => {
        dbTranslations[item.translation_key] = item.value;
      });

      return dbTranslations;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEnhancedTranslation = (language: Language) => {
  const { data: dbTranslations = {} } = useDynamicTranslations(language);

  const t = (key: string): string => {
    // First check database translations
    if (dbTranslations[key]) {
      return dbTranslations[key];
    }
    
    // Fall back to static translations with dot notation support
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if path doesn't exist
      }
    }
    
    // Only return if it's a string
    return typeof value === 'string' ? value : key;
  };

  return { t };
};
