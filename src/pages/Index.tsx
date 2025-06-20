
import { useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
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
      
      {/* Hidden SEO Navigation - Crawlable but not visible to users */}
      <nav className="sr-only" aria-label="Site map for search engines">
        <h2>Complete Site Navigation</h2>
        <ul>
          <li><Link to="/">Playa Cambutal Guide - Home</Link></li>
          <li><Link to="/surf">Surfing in Playa Cambutal, Panama</Link></li>
          <li><Link to="/eat">Restaurants and Dining in Playa Cambutal</Link></li>
          <li><Link to="/stay">Hotels and Accommodation in Playa Cambutal</Link></li>
          <li><Link to="/do">Activities and Adventures in Playa Cambutal</Link></li>
          <li><Link to="/calendar">Events Calendar - Playa Cambutal</Link></li>
          <li><Link to="/blog">Travel Blog - Playa Cambutal</Link></li>
          <li><Link to="/info">Travel Information and Guide</Link></li>
          <li><Link to="/transportation">Transportation to Playa Cambutal</Link></li>
          <li><Link to="/real-estate">Real Estate in Playa Cambutal</Link></li>
          
          {/* Restaurant links */}
          <li><Link to="/eat/centro-recreativo-jake">Centro Recreativo Jake Restaurant</Link></li>
          <li><Link to="/eat/fonda-norelis">Fonda Norelis Restaurant</Link></li>
          <li><Link to="/eat/monaco-bar-and-grill">Monaco Bar and Grill</Link></li>
          <li><Link to="/eat/pizzeria-madera">Pizzeria Madera</Link></li>
          <li><Link to="/eat/kambute">Kambute Restaurant</Link></li>
          <li><Link to="/eat/hotel-kambutaleko">Hotel Kambutaleko Restaurant</Link></li>
          <li><Link to="/eat/hotel-restaurante-cambutal-beach">Hotel Restaurante Cambutal Beach</Link></li>
          <li><Link to="/eat/la-tierra-de-mis-suenos">La Tierra de Mis Sueños</Link></li>
          <li><Link to="/eat/restaurante-casa-playa-verde">Restaurante Casa Playa Verde</Link></li>
          
          {/* Hotel links */}
          <li><Link to="/stay/hotel-kambutaleko">Hotel Kambutaleko</Link></li>
          <li><Link to="/stay/sansara-surf-and-yoga-resort">Sansara Surf and Yoga Resort</Link></li>
          <li><Link to="/stay/hotel-playa-cambutal">Hotel Playa Cambutal</Link></li>
          <li><Link to="/stay/stunning-beachfront-home-near-cambutal-beach-break">Stunning Beachfront Home</Link></li>
          <li><Link to="/stay/tropical-beachfront-home-in-cambutal">Tropical Beachfront Home</Link></li>
          
          {/* Activity links */}
          <li><Link to="/do/la-colectiva">La Colectiva Adventure Tours</Link></li>
          
          {/* Legal pages */}
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/legal">Legal Information</Link></li>
          <li><Link to="/disclosure">Disclosure</Link></li>
        </ul>
      </nav>

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelGuide",
          "name": "Playa Cambutal Guide",
          "description": "Complete travel guide to Playa Cambutal, Panama featuring restaurants, hotels, surfing, and activities",
          "url": "https://playacambutalguide.com",
          "about": {
            "@type": "Place",
            "name": "Playa Cambutal",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Cambutal",
              "addressCountry": "Panama"
            }
          },
          "mainEntity": [
            {
              "@type": "ItemList",
              "name": "Restaurants in Playa Cambutal",
              "url": "https://playacambutalguide.com/eat"
            },
            {
              "@type": "ItemList", 
              "name": "Hotels in Playa Cambutal",
              "url": "https://playacambutalguide.com/stay"
            },
            {
              "@type": "ItemList",
              "name": "Activities in Playa Cambutal", 
              "url": "https://playacambutalguide.com/do"
            },
            {
              "@type": "Article",
              "name": "Surfing Guide for Playa Cambutal",
              "url": "https://playacambutalguide.com/surf"
            }
          ]
        })}
      </script>
      
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
