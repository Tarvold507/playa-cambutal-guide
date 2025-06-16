
import { useEffect, Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedCMSHero from '../components/OptimizedCMSHero';
import Newsletter from '../components/Newsletter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OptimizedCMSIntroSection from '../components/home/OptimizedCMSIntroSection';
import CMSCardSection from '../components/home/CMSCardSection';
import OptimizedCMSFeaturedSections from '../components/home/OptimizedCMSFeaturedSections';
import HomeSEO from '../components/home/HomeSEO';
import { LazyEventCalendar, LazyBusinessDirectory, LazyLocalServices } from '../components/LazyComponents';
import { usePrefetchPageContent } from '@/hooks/useOptimizedPageContent';

// Loading components for Suspense fallbacks
const SectionLoader = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} flex items-center justify-center`}>
    <div className="w-8 h-8 border-4 border-gray-300 border-t-venao rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const { t } = useLanguage();
  const { prefetchPage } = usePrefetchPageContent();

  // Scroll to top and prefetch content on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Prefetch homepage content immediately
    prefetchPage('/');
    
    // Prefetch other common pages after a short delay
    setTimeout(() => {
      prefetchPage('/surf');
      prefetchPage('/eat');
      prefetchPage('/stay');
    }, 1000);
  }, [prefetchPage]);

  return (
    <div className="min-h-screen bg-white">
      <HomeSEO />
      <Navbar />
      
      {/* Hero Section - optimized with image preloading */}
      <OptimizedCMSHero 
        pagePath="/"
        fallbackTitle={t('home.hero.title')}
        fallbackSubtitle={t('home.hero.subtitle')}
        fallbackImageSrc="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
      />
      
      {/* Intro Section - optimized */}
      <OptimizedCMSIntroSection />
      
      {/* Card Section - now uses CMS content */}
      <CMSCardSection />
      
      {/* Calendar Section - lazy loaded */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionLoader />}>
            <LazyEventCalendar />
          </Suspense>
        </div>
      </section>

      {/* Business Directory Section - lazy loaded */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionLoader />}>
            <LazyBusinessDirectory />
          </Suspense>
        </div>
      </section>

      {/* Local Services Section - lazy loaded */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionLoader />}>
            <LazyLocalServices />
          </Suspense>
        </div>
      </section>
      
      {/* Featured Sections - optimized */}
      <OptimizedCMSFeaturedSections />
      
      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
