
import { useLanguage } from '@/contexts/LanguageContext';
import { useCMSContent } from '@/hooks/useCMSContent';

const CMSIntroSection = () => {
  const { t } = useLanguage();
  
  // Use CMS content with fallback to translations
  const { content: cmsContent, isReady } = useCMSContent('/', 'intro', {
    title: t('home.intro.title'),
    text: `${t('home.intro.paragraph1')}\n\n${t('home.intro.paragraph2')}\n\n${t('home.intro.paragraph3')}`
  });

  // Show loading skeleton while content is being fetched
  if (!isReady) {
    return (
      <section className="bg-white py-16 md:py-24" id="content">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="w-96 h-10 bg-gray-200 rounded mb-6 mx-auto animate-pulse"></div>
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24" id="content">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {cmsContent?.title || t('home.intro.title')}
        </h1>
        {cmsContent?.text ? (
          cmsContent.text.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-600 mb-4">
              {paragraph}
            </p>
          ))
        ) : (
          <>
            <p className="text-gray-600 mb-4">{t('home.intro.paragraph1')}</p>
            <p className="text-gray-600 mb-4">{t('home.intro.paragraph2')}</p>
            <p className="text-gray-600">{t('home.intro.paragraph3')}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default CMSIntroSection;
