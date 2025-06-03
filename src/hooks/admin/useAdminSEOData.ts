
import { useState, useEffect } from 'react';
import { usePageSEO, PageSEO } from '@/hooks/usePageSEO';

export const useAdminSEOData = () => {
  const { pageSEO, fetchPageSEO } = usePageSEO();
  const [loading, setLoading] = useState(true);

  const refreshSEOData = async () => {
    setLoading(true);
    await fetchPageSEO();
    setLoading(false);
  };

  useEffect(() => {
    refreshSEOData();
  }, []);

  return {
    pageSEO,
    loading,
    refreshSEOData,
  };
};
