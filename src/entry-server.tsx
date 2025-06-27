
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string) {
  try {
    console.log(`[SSR] Rendering ${url}`);
    
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    );
    
    console.log(`[SSR] Successfully rendered ${url}, length: ${html.length}`);
    return html;
  } catch (error) {
    console.error('[SSR] Error rendering', url, ':', error);
    
    // Return a more comprehensive fallback that includes the basic structure
    // This ensures the page will still work even if SSR fails
    return `
      <div id="root">
        <div class="min-h-screen bg-white">
          <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">Playa Cambutal Guide</h1>
              <p class="text-gray-600">Loading your ultimate travel guide to Panama's hidden paradise...</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default { render };
