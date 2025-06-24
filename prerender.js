
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Define all static routes from App.tsx
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
  // Note: Dynamic routes like /eat/:restaurantSlug, /stay/:hotelSlug, /blog/:slug, /do/:businessSlug
  // will need to be added manually when new content is created
]

// Helper function to ensure directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log('Created directory:', dir)
  }
}

;(async () => {
  for (const url of routesToPrerender) {
    try {
      console.log('Pre-rendering:', url)
      const appHtml = render(url)
      const html = template.replace(`<!--app-html-->`, appHtml)

      const filePath = url === '/' 
        ? toAbsolute('dist/index.html')
        : toAbsolute(`dist${url}/index.html`)
      
      // Ensure the directory exists before writing
      ensureDirectoryExists(filePath)
      
      fs.writeFileSync(filePath, html)
      console.log('✅ Pre-rendered:', filePath)
    } catch (error) {
      console.error('❌ Error pre-rendering', url, ':', error.message)
    }
  }
  
  console.log('\n🎉 Static site generation complete!')
  console.log('📁 Generated files in dist/ directory')
  console.log('\n📝 To add dynamic routes (restaurants, hotels, blog posts):')
  console.log('   - Add specific routes to routesToPrerender array')
  console.log('   - Example: "/eat/restaurant-slug", "/blog/post-slug"')
})()
