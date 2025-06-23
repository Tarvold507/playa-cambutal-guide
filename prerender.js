
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Routes that match App.tsx - these are the static routes we can prerender
const routesToPrerender = [
  '/',
  '/eat',
  '/stay', 
  '/do',
  '/surf',
  '/blog',
  '/calendar',
  '/transportation',
  '/real-estate',
  '/info',
  '/legal',
  '/privacy',
  '/terms',
  '/disclosure',
  '/auth',
  '/profile',
  '/my-listings',
  '/add-restaurant',
  '/add-hotel',
  '/add-blog',
  '/admin'
]

// Helper function to ensure directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Helper function to inject SEO data into HTML
const injectSEOIntoHTML = (html, seoHead) => {
  const headCloseIndex = html.indexOf('</head>');
  if (headCloseIndex === -1) {
    console.warn('No </head> tag found in HTML template');
    return html;
  }
  
  return html.slice(0, headCloseIndex) + seoHead + html.slice(headCloseIndex);
};

;(async () => {
  console.log('🚀 Starting prerender with SEO data...');
  
  for (const url of routesToPrerender) {
    try {
      console.log(`📄 Pre-rendering ${url}...`);
      
      // Get the rendered content with SEO data
      const renderResult = await render(url);
      
      // Replace the app placeholder with rendered HTML
      let html = template.replace(`<!--app-html-->`, renderResult.html);
      
      // Inject SEO data into the head
      if (renderResult.seoHead) {
        html = injectSEOIntoHTML(html, renderResult.seoHead);
      }

      const filePath = `dist${url === '/' ? '/index' : url}.html`
      const absoluteFilePath = toAbsolute(filePath)
      
      // Ensure the directory exists before writing the file
      ensureDirectoryExists(absoluteFilePath)
      
      fs.writeFileSync(absoluteFilePath, html)
      console.log('✅ Pre-rendered with SEO:', filePath)
    } catch (error) {
      console.error(`❌ Error pre-rendering ${url}:`, error.message)
      // Continue with other routes even if one fails
    }
  }
  
  console.log('🎉 Prerender complete!');
})()
