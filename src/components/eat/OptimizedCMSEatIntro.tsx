
import { useOptimizedPageContent } from '@/hooks/useOptimizedPageContent';
import { useLanguage } from '@/contexts/LanguageContext';

const OptimizedCMSEatIntro = () => {
  const { getContentBySection, isLoading } = useOptimizedPageContent('/eat');
  const { t } = useLanguage();

  const introContent = getContentBySection('intro', {
    title: t('eat.intro.title') || 'Discover Amazing Dining',
    description: t('eat.intro.description') || 'Playa Cambutal offers a diverse culinary scene that reflects both local Panamanian flavors and international cuisine. From beachfront restaurants serving fresh seafood to cozy cafes with artisanal coffee, you\'ll find dining options to satisfy every palate.',
    subtitle: t('eat.intro.subtitle') || 'Most restaurants are located within walking distance of the beach and accommodations, making it easy to explore the local food scene during your stay.'
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

export default OptimizedCMSEatIntro;
