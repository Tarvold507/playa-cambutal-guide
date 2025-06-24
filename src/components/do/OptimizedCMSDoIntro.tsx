
import { useOptimizedPageContent } from '@/hooks/useOptimizedPageContent';
import { useLanguage } from '@/contexts/LanguageContext';

const OptimizedCMSDoIntro = () => {
  const { getContentBySection, isLoading } = useOptimizedPageContent('/do');
  const { t } = useLanguage();

  const introContent = getContentBySection('intro', {
    title: t('do.intro.title', 'Experience Cambutal, Panama'),
    description: t('do.intro.description', 'From world-class surfing to breathtaking nature experiences, Playa Cambutal offers endless opportunities for adventure in Panama. Whether you\'re seeking the perfect wave, wanting to explore Panama\'s pristine jungles, or looking to connect with nature through yoga on the beach, you\'ll find your perfect adventure in this Pacific coast paradise.')
  });

  if (isLoading) {
    return (
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="h-8 bg-gray-300 rounded mb-6 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
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
      </div>
    </section>
  );
};

export default OptimizedCMSDoIntro;
