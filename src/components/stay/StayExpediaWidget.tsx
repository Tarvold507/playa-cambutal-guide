
import { useState, useEffect } from 'react';

// Add TypeScript declaration for the Expedia widget
declare global {
  interface Window {
    EGWidgets: {
      init: () => void;
    };
  }
}

const StayExpediaWidget = () => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Load Expedia widget script with proper initialization
    const loadExpediaWidget = () => {
      // Check if script already exists
      const existingScript = document.querySelector('.eg-widgets-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.className = 'eg-widgets-script';
      script.src = 'https://affiliates.expediagroup.com/products/widgets/assets/eg-widgets.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Expedia widget script loaded successfully');
        setWidgetLoaded(true);
        
        // Initialize widget after script loads
        setTimeout(() => {
          if (window.EGWidgets) {
            try {
              window.EGWidgets.init();
              console.log('Expedia widget initialized');
            } catch (error) {
              console.error('Error initializing Expedia widget:', error);
            }
          } else {
            console.warn('EGWidgets not available on window object');
          }
        }, 100);
      };
      
      script.onerror = () => {
        console.error('Failed to load Expedia widget script');
      };
      
      document.head.appendChild(script);
    };

    // Load the widget script
    loadExpediaWidget();

    // Cleanup script on unmount
    return () => {
      const existingScript = document.querySelector('.eg-widgets-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Re-initialize widget when it becomes visible
  useEffect(() => {
    if (widgetLoaded && window.EGWidgets) {
      const timer = setTimeout(() => {
        try {
          window.EGWidgets.init();
          console.log('Re-initialized Expedia widget');
        } catch (error) {
          console.error('Error re-initializing widget:', error);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [widgetLoaded]);

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
            {!widgetLoaded && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venao-dark mx-auto mb-4"></div>
                <p className="text-gray-600">Loading booking widget...</p>
              </div>
            )}
            <div 
              id="expedia-search-widget"
              className="eg-widget" 
              data-widget="search" 
              data-program="us-expedia" 
              data-lobs="stays,flights" 
              data-network="pz" 
              data-camref="1100l5aKtR"
              data-theme="light"
              data-currency="USD"
              data-language="en"
              style={{ minHeight: widgetLoaded ? 'auto' : '400px' }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayExpediaWidget;
