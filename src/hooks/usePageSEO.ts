
import { usePageSEOData } from './seo/usePageSEOData';
import { usePageSEOUpdate } from './seo/usePageSEOUpdate';
import { useBulkSEOActions } from './seo/useBulkSEOActions';
import { useStaticSEOGeneration } from './seo/useStaticSEOGeneration';
import { usePublicDirectoryDeployment } from './seo/usePublicDirectoryDeployment';

export type { PageSEO } from './seo/types';

export const usePageSEO = () => {
  const { pageSEO, loading, fetchPageSEO, fetchSEOByPath } = usePageSEOData();
  const { updatePageSEO } = usePageSEOUpdate();
  const { bulkUpdateCanonicalUrls } = useBulkSEOActions();
  const { regenerateStaticSEOFiles } = useStaticSEOGeneration();
  const { deployToPublicDirectory } = usePublicDirectoryDeployment();

  return {
    pageSEO,
    loading,
    fetchPageSEO,
    fetchSEOByPath,
    updatePageSEO,
    bulkUpdateCanonicalUrls,
    regenerateStaticSEOFiles,
    deployToPublicDirectory,
  };
};
