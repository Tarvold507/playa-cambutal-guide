
import { useLanguage } from '@/contexts/LanguageContext';
import CardSection from '../CardSection';

const HomeCardSection = () => {
  const { t } = useLanguage();

  const cardItems = [
    {
      id: '1',
      title: t('home.cards.hotels.title'),
      description: t('home.cards.hotels.description'),
      imageSrc: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: '/stay',
      category: 'Stay'
    },
    {
      id: '2',
      title: t('home.cards.restaurants.title'),
      description: t('home.cards.restaurants.description'),
      imageSrc: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: '/eat',
      category: 'Eat'
    },
    {
      id: '3',
      title: t('home.cards.surf.title'),
      description: t('home.cards.surf.description'),
      imageSrc: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: '/do',
      category: 'Surf'
    },
    {
      id: '4',
      title: t('home.cards.yoga.title'),
      description: t('home.cards.yoga.description'),
      imageSrc: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: '/do',
      category: 'Do'
    },
    {
      id: '5',
      title: t('home.cards.wildlife.title'),
      description: t('home.cards.wildlife.description'),
      imageSrc: 'https://images.unsplash.com/photo-1542736705-53f0131d1e98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: '/do',
      category: 'Do'
    },
    {
      id: '6',
      title: t('home.cards.transport.title'),
      description: t('home.cards.transport.description'),
      imageSrc: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: '/info#transportation',
      category: 'Transport'
    }
  ];

  return (
    <CardSection 
      title={t('home.explore.title')}
      description={t('home.explore.description')}
      items={cardItems}
      bgColor="bg-gray-50"
    />
  );
};

export default HomeCardSection;
