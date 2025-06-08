
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCalendar from '../components/EventCalendar';
import BusinessDirectory from '../components/BusinessDirectory';
import LocalServices from '../components/LocalServices';
import IntroSection from '../components/home/IntroSection';
import HomeCardSection from '../components/home/HomeCardSection';
import FeaturedSections from '../components/home/FeaturedSections';
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
      
      {/* Hero Section */}
      <Hero 
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
        imageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section */}
      <IntroSection />
      
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
      
      {/* Featured Sections */}
      <FeaturedSections />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
