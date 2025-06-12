
import { useLanguage } from '@/contexts/LanguageContext';
import { useCMSContent } from '@/hooks/useCMSContent';
import Featured from '../Featured';

const CMSFeaturedSections = () => {
  const { t } = useLanguage();
  
  // Get CMS content for each section - don't provide fallback content
  const { content: surfContent, isReady: surfReady } = useCMSContent('/', 'surf-featured');
  const { content: cuisineContent, isReady: cuisineReady } = useCMSContent('/', 'cuisine-featured');

  // Show loading skeleton while content is being fetched
  if (!surfReady || !cuisineReady) {
    return (
      <div className="space-y-16">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Only render surf section if it has visible CMS content */}
      {surfContent && (
        <Featured 
          title={surfContent.title || t('home.featured.surf.title')}
          description={surfContent.description || t('home.featured.surf.description')}
          imageSrc={surfContent.imageSrc || "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
          imageAlt="Surfer riding a wave at Playa Cambutal, Panama"
          link={surfContent.link || "/surf"}
          linkText={surfContent.linkText || t('home.featured.surf.linkText')}
          imageOnRight={surfContent.imageOnRight !== undefined ? surfContent.imageOnRight : true}
        />
      )}
      
      {/* Only render cuisine section if it has visible CMS content */}
      {cuisineContent && (
        <Featured 
          title={cuisineContent.title || t('home.featured.cuisine.title')}
          description={cuisineContent.description || t('home.featured.cuisine.description')}
          imageSrc={cuisineContent.imageSrc || "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
          imageAlt="Delicious Panamanian food at a beachfront restaurant in Cambutal"
          link={cuisineContent.link || "/eat"}
          linkText={cuisineContent.linkText || t('home.featured.cuisine.linkText')}
          imageOnRight={cuisineContent.imageOnRight !== undefined ? cuisineContent.imageOnRight : false}
        />
      )}
    </>
  );
};

export default CMSFeaturedSections;
