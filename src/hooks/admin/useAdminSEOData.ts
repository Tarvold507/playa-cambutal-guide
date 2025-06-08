
import { useState, useEffect } from 'react';
import { usePageSEO, PageSEO } from '@/hooks/usePageSEO';
import { useAdminSEOBulkActions } from './useAdminSEOBulkActions';

export const useAdminSEOData = () => {
  const { pageSEO, fetchPageSEO } = usePageSEO();
  const [loading, setLoading] = useState(true);
  const bulkActions = useAdminSEOBulkActions();

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
    ...bulkActions,
  };
};
