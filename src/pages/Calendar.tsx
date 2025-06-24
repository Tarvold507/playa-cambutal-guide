
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CMSHero from '../components/CMSHero';
import Newsletter from '../components/Newsletter';
import EventCalendar from '../components/EventCalendar';
import CalendarSEO from '../components/calendar/CalendarSEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Calendar = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CalendarSEO />
      <Navbar />
      
      <CMSHero 
        pagePath="/calendar"
        fallbackTitle={t('events.title')}
        fallbackSubtitle={t('events.subtitle')}
        fallbackImageSrc="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <EventCalendar />
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Calendar;
