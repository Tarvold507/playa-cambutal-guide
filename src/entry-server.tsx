
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string) {
  try {
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    );
    
    return html;
  } catch (error) {
    console.error('SSR Error for', url, ':', error);
    // Return a basic div that React can hydrate into
    return '<div id="root">Loading...</div>';
  }
}

export default { render };
