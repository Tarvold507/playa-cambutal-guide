
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import Featured from '../components/Featured';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCalendar from '../components/EventCalendar';
import BusinessDirectory from '../components/BusinessDirectory';
import LocalServices from '../components/LocalServices';

const Index = () => {
  const { t } = useLanguage();

  // Sample data for our sections - now using translations
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
      link: '/surf',
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
      link: '/transportation',
      category: 'Transport'
    }
  ];

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Playa Cambutal Guide - Discover Panama's Hidden Paradise",
      "description": "Complete travel guide to Playa Cambutal, Panama. Find the best hotels, restaurants, surf spots, and activities in this beautiful beach destination.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "TouristDestination",
        "name": "Playa Cambutal",
        "description": "A horseshoe-shaped bay on Panama's Pacific coast known for consistent waves, stunning sunsets, and laid-back atmosphere.",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 7.2833,
          "longitude": -80.5167
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "Panama",
          "addressRegion": "Los Santos Province",
          "addressLocality": "Cambutal"
        }
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.textContent === JSON.stringify(structuredData)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
        imageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
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
      
      {/* Card Section */}
      <CardSection 
        title={t('home.explore.title')}
        description={t('home.explore.description')}
        items={cardItems}
        bgColor="bg-gray-50"
      />
      
      {/* Calendar Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <EventCalendar />
        </div>
      </section>

      {/* Business Directory Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BusinessDirectory />
        </div>
      </section>

      {/* Local Services Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <LocalServices />
        </div>
      </section>
      
      {/* Featured Sections */}
      <Featured 
        title={t('home.featured.surf.title')}
        description={t('home.featured.surf.description')}
        imageSrc="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Surfer riding a wave at Playa Cambutal, Panama"
        link="/surf"
        linkText={t('home.featured.surf.linkText')}
        imageOnRight={true}
      />
      
      {/* Second Featured Section */}
      <Featured 
        title={t('home.featured.cuisine.title')}
        description={t('home.featured.cuisine.description')}
        imageSrc="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        imageAlt="Delicious Panamanian food at a beachfront restaurant in Cambutal"
        link="/eat"
        linkText={t('home.featured.cuisine.linkText')}
        imageOnRight={false}
      />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
