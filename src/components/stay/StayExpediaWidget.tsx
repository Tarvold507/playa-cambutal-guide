
import { useState, useEffect, useRef } from 'react';

const StayExpediaWidget = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // First useEffect: Ensure the DOM element is ready
  useEffect(() => {
    const checkElementReady = () => {
      if (widgetRef.current && document.contains(widgetRef.current)) {
        const element = widgetRef.current;
        // Verify all required attributes are present
        if (element.getAttribute('data-widget') && 
            element.getAttribute('data-program') && 
            element.getAttribute('data-lobs')) {
          console.log('Widget element is ready');
          setElementReady(true);
          return;
        }
      }
      // Retry if not ready
      setTimeout(checkElementReady, 100);
    };

    // Start checking after a small delay to let React render
    const timeoutId = setTimeout(checkElementReady, 200);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Second useEffect: Load script only when element is ready
  useEffect(() => {
    if (!elementReady) return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="eg-widgets.js"]');
    if (existingScript) {
      setScriptLoaded(true);
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

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[src*="eg-widgets.js"]');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [elementReady]);

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
            {(!scriptLoaded && !loadError) && (
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
