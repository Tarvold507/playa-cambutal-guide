import fs from 'node:fs'
import path from 'node:path'
import { toAbsolute } from './build-utils.js'
import {
  fetchSEOData,
  fetchListingData,
  generateListingSEO,
  generateStructuredData,
  injectSEOData,
  getFallbackSEO,
  getFallbackStructuredData
} from './seo-utils.js'

export async function prerenderPage(url, template, render, options = {}) {
  try {
    console.log(`📄 Prerendering: ${url}`)
    
    // Render the React app with error handling
    let appHtml
    try {
      appHtml = render(url)
      console.log(`✅ SSR render successful for ${url}, content length: ${appHtml.length}`)
    } catch (renderError) {
      console.warn(`⚠️ SSR render failed for ${url}:`, renderError.message)
      appHtml = '<div id="root"><div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div><p class="text-gray-600">Loading Playa Cambutal Guide...</p></div></div></div>'
    }
    
    // Replace the placeholder with rendered content
    let html = template.replace('<!--app-html-->', appHtml)
    
    // Validate the replacement worked
    if (html === template) {
      console.warn(`⚠️ Template replacement may have failed for ${url}`)
    }
    
    // Fetch and inject SEO data
    let seoData = await fetchSEOData(url)
    let structuredData = null
    
    // Handle dynamic routes
    if (!seoData) {
      const pathParts = url.split('/')
      
      if (pathParts[1] === 'stay' && pathParts[2]) {
        const hotelData = await fetchListingData('hotel', pathParts[2])
        if (hotelData) {
          seoData = generateListingSEO('hotel', hotelData, pathParts[2])
          structuredData = generateStructuredData('hotel', hotelData, seoData)
          console.log(`🏨 Generated hotel SEO for ${pathParts[2]}`)
        }
      } else if (pathParts[1] === 'eat' && pathParts[2]) {
        const restaurantData = await fetchListingData('restaurant', pathParts[2])
        if (restaurantData) {
          seoData = generateListingSEO('restaurant', restaurantData, pathParts[2])
          structuredData = generateStructuredData('restaurant', restaurantData, seoData)
          console.log(`🍽️ Generated restaurant SEO for ${pathParts[2]}`)
        }
      } else if (pathParts[1] === 'blog' && pathParts[2]) {
        const blogData = await fetchListingData('blog', pathParts[2])
        if (blogData) {
          seoData = generateListingSEO('blog', blogData, pathParts[2])
          structuredData = generateStructuredData('blog', blogData, seoData)
          console.log(`📝 Generated blog SEO for ${pathParts[2]}`)
        }
      }
    }
    
    // Apply fallback SEO for pages without database data
    if (!seoData) {
      seoData = getFallbackSEO(url)
      // Also generate structured data for static pages
      if (!structuredData) {
        structuredData = getFallbackStructuredData(url)
      }
      console.log(`🔄 Using fallback SEO for ${url}`)
    }

    // Inject SEO data
    if (seoData) {
      html = injectSEOData(html, seoData, structuredData)
    }
    
    // Inject static listing links outside #root so crawlers can discover
    // individual pages that are only rendered client-side via Supabase hooks.
    if (options.relatedLinks && options.relatedLinks.length > 0) {
      const items = options.relatedLinks
        .map(({ path, label }) => `<li><a href="${path}">${label}</a></li>`)
        .join('')
      const nav = [
        '<nav aria-label="Browse listings" style="padding:12px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b">',
        `<span>Browse: </span><ul style="display:inline;list-style:none;padding:0;margin:0">${items}</ul>`,
        '</nav>'
      ].join('')
      html = html.replace('</body>', `${nav}\n</body>`)
      console.log(`🔗 Injected ${options.relatedLinks.length} static listing links for ${url}`)
    }

    // Write the file
    const filePath = url === '/' ? 'dist/index.html' : `dist${url}/index.html`
    const dirPath = path.dirname(toAbsolute(filePath))
    
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log(`✅ Pre-rendered: ${filePath}`)
    
    // Validate the written file
    const writtenFile = fs.readFileSync(toAbsolute(filePath), 'utf-8')
    if (writtenFile.length < 1000) {
      console.warn(`⚠️ Generated file ${filePath} seems too small (${writtenFile.length} chars)`)
    }
    
    return true
    
  } catch (error) {
    console.error(`❌ Failed to prerender ${url}:`, error)
    return false
  }
}