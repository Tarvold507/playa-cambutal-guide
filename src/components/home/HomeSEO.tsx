
import { useEffect } from 'react';

const HomeSEO = () => {
  useEffect(() => {
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

  return null;
};

export default HomeSEO;
