
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CMSHero from '../components/CMSHero';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCalendar from '../components/EventCalendar';
import BusinessDirectory from '../components/BusinessDirectory';
import LocalServices from '../components/LocalServices';
import CMSIntroSection from '../components/home/CMSIntroSection';
import HomeCardSection from '../components/home/HomeCardSection';
import CMSFeaturedSections from '../components/home/CMSFeaturedSections';
import HomeSEO from '../components/home/HomeSEO';

const Index = () => {
  const { t } = useLanguage();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HomeSEO />
      <Navbar />
      
      {/* Hero Section - now uses CMS */}
      <CMSHero 
        pagePath="/"
        fallbackTitle={t('home.hero.title')}
        fallbackSubtitle={t('home.hero.subtitle')}
        fallbackImageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section - now uses CMS */}
      <CMSIntroSection />
      
      {/* Card Section */}
      <HomeCardSection />
      
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
      
      {/* Featured Sections - now uses CMS */}
      <CMSFeaturedSections />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
