
import { useState, useLayoutEffect, useRef } from 'react';

const StayExpediaWidget = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="eg-widgets.js"]');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    // Ensure the widget container exists before loading script
    if (!widgetRef.current) {
      console.error('Widget container not found');
      setLoadError(true);
      return;
    }

    // Add a small delay to ensure React has completed its render cycle
    const timeoutId = setTimeout(() => {
      // Double-check the element exists
      if (!widgetRef.current) {
        console.error('Widget container disappeared');
        setLoadError(true);
        return;
      }

      console.log('Loading Expedia widget script...');
      const script = document.createElement('script');
      script.src = 'https://affiliates.expediagroup.com/products/widgets/assets/eg-widgets.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Expedia widget script loaded successfully');
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Expedia widget script');
        setLoadError(true);
      };
      
      document.head.appendChild(script);
    }, 100); // Small delay to ensure DOM is ready

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      const scriptToRemove = document.querySelector('script[src*="eg-widgets.js"]');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Your Stay</h2>
          <p className="text-gray-600">
            Compare prices and book accommodations in Playa Cambutal and surrounding areas.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg">
            {!scriptLoaded && !loadError && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venao-dark mx-auto mb-4"></div>
                <p className="text-gray-600">Loading booking widget...</p>
              </div>
            )}
            
            {loadError && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Unable to load booking widget.</p>
                <p className="text-sm text-gray-500">Please try refreshing the page or visit Expedia directly.</p>
              </div>
            )}
            
            <div 
              ref={widgetRef}
              className="eg-widget" 
              data-widget="search" 
              data-program="us-expedia" 
              data-lobs="stays,flights" 
              data-network="pz" 
              data-camref="1100l5aKtR"
              data-theme="light"
              data-currency="USD"
              data-language="en"
              data-location="Playa Cambutal, Panama"
              style={{ 
                minHeight: scriptLoaded ? 'auto' : '400px',
                display: loadError ? 'none' : 'block'
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayExpediaWidget;
