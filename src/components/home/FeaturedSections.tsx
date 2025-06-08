
import { useLanguage } from '@/contexts/LanguageContext';
import Featured from '../Featured';

const FeaturedSections = () => {
  const { t } = useLanguage();

  return (
    <>
      <Featured 
        title={t('home.featured.surf.title')}
        description={t('home.featured.surf.description')}
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Cambutal, Panama"
        link="/surf"
        linkText={t('home.featured.surf.linkText')}
        imageOnRight={true}
      />
      
      <Featured 
        title={t('home.featured.cuisine.title')}
        description={t('home.featured.cuisine.description')}
        imageSrc="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Delicious Panamanian food at a beachfront restaurant in Cambutal"
        link="/eat"
        linkText={t('home.featured.cuisine.linkText')}
        imageOnRight={false}
      />
    </>
  );
};

export default FeaturedSections;
