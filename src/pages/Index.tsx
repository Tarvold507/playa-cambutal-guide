
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
      
      {/* Static Navigation Links for SEO - Always Visible */}
      <section className="bg-blue-50 py-8" id="quick-navigation">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Explore Playa Cambutal</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/eat" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-gray-800">Restaurants</h3>
              <p className="text-sm text-gray-600 mt-2">Local dining spots</p>
            </Link>
            <Link to="/stay" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-gray-800">Hotels</h3>
              <p className="text-sm text-gray-600 mt-2">Places to stay</p>
            </Link>
            <Link to="/do" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-gray-800">Activities</h3>
              <p className="text-sm text-gray-600 mt-2">Things to do</p>
            </Link>
            <Link to="/surf" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-gray-800">Surfing</h3>
              <p className="text-sm text-gray-600 mt-2">Surf guide</p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Intro Section - optimized */}
      <OptimizedCMSIntroSection />
      
      {/* Card Section - now uses CMS content */}
      <CMSCardSection />
      
      {/* Static Popular Destinations Section for SEO */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Destinations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                <Link to="/eat/centro-recreativo-jake" className="text-blue-600 hover:text-blue-800">
                  Centro Recreativo Jake
                </Link>
              </h3>
              <p className="text-gray-600">Popular beachfront restaurant with fresh seafood and local cuisine.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                <Link to="/stay/sansara-surf-and-yoga-resort" className="text-blue-600 hover:text-blue-800">
                  Sansara Surf and Yoga Resort
                </Link>
              </h3>
              <p className="text-gray-600">Luxury surf resort offering yoga classes and premium accommodations.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                <Link to="/stay/hotel-kambutaleko" className="text-blue-600 hover:text-blue-800">
                  Hotel Kambutaleko
                </Link>
              </h3>
              <p className="text-gray-600">Charming beachfront hotel with restaurant and stunning ocean views.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                <Link to="/eat/monaco-bar-and-grill" className="text-blue-600 hover:text-blue-800">
                  Monaco Bar and Grill
                </Link>
              </h3>
              <p className="text-gray-600">Casual dining with international cuisine and cold drinks.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                <Link to="/do/la-colectiva" className="text-blue-600 hover:text-blue-800">
                  La Colectiva
                </Link>
              </h3>
              <p className="text-gray-600">Adventure tours and outdoor activities in the Cambutal area.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                <Link to="/eat/pizzeria-madera" className="text-blue-600 hover:text-blue-800">
                  Pizzeria Madera
                </Link>
              </h3>
              <p className="text-gray-600">Wood-fired pizza in a relaxed beachside atmosphere.</p>
            </div>
          </div>
        </div>
      </section>
      
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
