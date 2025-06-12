
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import DoPageHero from '../components/do/DoPageHero';
import DoPageIntro from '../components/do/DoPageIntro';
import DoActivitiesSection from '../components/do/DoActivitiesSection';
import DoBusinessSubmission from '../components/do/DoBusinessSubmission';
import DoFeaturedSections from '../components/do/DoFeaturedSections';
import { useDoPageLogic } from '../hooks/useDoPageLogic';

const Do = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    isLoading,
    error
  } = useDoPageLogic();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Things to Do in Cambutal, Panama - Activities & Tours",
      "description": "Discover exciting activities in Playa Cambutal, Panama. From surfing and yoga to wildlife tours and fishing charters.",
      "url": window.location.href,
      "mainEntity": {
        "@type": "TouristDestination",
        "name": "Cambutal Activities",
        "description": "Activities and tours in Playa Cambutal, Panama",
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
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.textContent === JSON.stringify(structuredData)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <DoPageHero />
      <DoPageIntro />
      <DoActivitiesSection 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filteredItems={filteredItems}
        isLoading={isLoading}
      />
      <DoBusinessSubmission />
      <DoFeaturedSections />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Do;
