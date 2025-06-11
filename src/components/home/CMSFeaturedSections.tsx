
import { useLanguage } from '@/contexts/LanguageContext';
import { useCMSContent } from '@/hooks/useCMSContent';
import Featured from '../Featured';

const CMSFeaturedSections = () => {
  const { t } = useLanguage();

  // Use CMS content with fallback to translations
  const { content: surfContent, isReady: surfReady } = useCMSContent('/', 'surf-featured', {
    title: t('home.featured.surf.title'),
    description: t('home.featured.surf.description'),
    imageSrc: "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Surfer riding a wave at Playa Cambutal, Panama",
    link: "/surf",
    linkText: t('home.featured.surf.linkText'),
    imageOnRight: true
  });

  const { content: cuisineContent, isReady: cuisineReady } = useCMSContent('/', 'cuisine-featured', {
    title: t('home.featured.cuisine.title'),
    description: t('home.featured.cuisine.description'),
    imageSrc: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Delicious Panamanian food at a beachfront restaurant in Cambutal",
    link: "/eat",
    linkText: t('home.featured.cuisine.linkText'),
    imageOnRight: false
  });

  // Show loading skeleton while content is being fetched
  if (!surfReady || !cuisineReady) {
    return (
      <div className="space-y-16">
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-4">
                <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Featured 
        title={surfContent?.title || t('home.featured.surf.title')}
        description={surfContent?.description || t('home.featured.surf.description')}
        imageSrc={surfContent?.imageSrc || "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
        imageAlt={surfContent?.imageAlt || "Surfer riding a wave at Playa Cambutal, Panama"}
        link={surfContent?.link || "/surf"}
        linkText={surfContent?.linkText || t('home.featured.surf.linkText')}
        imageOnRight={surfContent?.imageOnRight ?? true}
      />
      
      <Featured 
        title={cuisineContent?.title || t('home.featured.cuisine.title')}
        description={cuisineContent?.description || t('home.featured.cuisine.description')}
        imageSrc={cuisineContent?.imageSrc || "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
        imageAlt={cuisineContent?.imageAlt || "Delicious Panamanian food at a beachfront restaurant in Cambutal"}
        link={cuisineContent?.link || "/eat"}
        linkText={cuisineContent?.linkText || t('home.featured.cuisine.linkText')}
        imageOnRight={cuisineContent?.imageOnRight ?? false}
      />
    </>
  );
};

export default CMSFeaturedSections;
