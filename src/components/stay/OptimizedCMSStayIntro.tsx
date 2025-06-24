
import { useOptimizedPageContent } from '@/hooks/useOptimizedPageContent';
import { useLanguage } from '@/contexts/LanguageContext';

const OptimizedCMSStayIntro = () => {
  const { getContentBySection, isLoading } = useOptimizedPageContent('/stay');
  const { t } = useLanguage();

  const introContent = getContentBySection('intro', {
    title: t('stay.intro.title', 'Find Your Perfect Stay'),
    description: t('stay.intro.description', 'From beachfront hotels to cozy boutique accommodations, Playa Cambutal offers a variety of lodging options to suit every traveler\'s needs and budget. Wake up to the sound of waves and enjoy stunning ocean views.'),
    subtitle: t('stay.intro.subtitle', 'All accommodations are carefully selected to ensure comfort, quality, and authentic Panamanian hospitality.')
  });

  if (isLoading) {
    return (
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="h-8 bg-gray-300 rounded mb-6 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24" id="content">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {introContent.title}
        </h1>
        <p className="text-gray-600 mb-4">
          {introContent.description}
        </p>
        {introContent.subtitle && (
          <p className="text-gray-600">
            {introContent.subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default OptimizedCMSStayIntro;
