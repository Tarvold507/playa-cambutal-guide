
import { useLanguage } from '@/contexts/LanguageContext';

const IntroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-16 md:py-24" id="content">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{t('home.intro.title')}</h1>
        <p className="text-gray-600 mb-4">
          {t('home.intro.paragraph1')}
        </p>
        <p className="text-gray-600 mb-4">
          {t('home.intro.paragraph2')}
        </p>
        <p className="text-gray-600">
          {t('home.intro.paragraph3')}
        </p>
      </div>
    </section>
  );
};

export default IntroSection;
