import { validateBuildOutput } from './lib/build-utils.js'
import { buildSSR, loadServerRenderer } from './lib/ssr-utils.js'
import { getStaticRoutes, fetchDynamicRoutes } from './lib/route-utils.js'
import { prerenderPage } from './lib/prerender-page.js'

async function main() {
  console.log('🚀 Starting enhanced prerendering process...')
  
  try {
    // Step 1: Validate build output
    const { template } = validateBuildOutput()
    
    // Step 2: Build SSR
    const ssrBuilt = await buildSSR()
    
    // Step 3: Load renderer
    const render = await loadServerRenderer()
    
    // Step 4: Get all routes to prerender
    const staticRoutes = getStaticRoutes()
    const dynamicRoutes = await fetchDynamicRoutes()
    const allRoutes = [...staticRoutes, ...dynamicRoutes]
    
    console.log(`🚀 Prerendering ${allRoutes.length} routes (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)...`)
    
    // Step 5: Prerender all routes
    let successCount = 0
    let failureCount = 0
    
    for (const url of allRoutes) {
      const success = await prerenderPage(url, template, render)
      if (success) {
        successCount++
      } else {
        failureCount++
      }
    }
    
    // Step 6: Generate summary
    console.log('\n🎉 Prerendering completed!')
    console.log(`✅ Successfully prerendered: ${successCount} pages`)
    if (failureCount > 0) {
      console.log(`❌ Failed to prerender: ${failureCount} pages`)
    }
    
    // Step 7: Validation recommendations
    console.log('\n📋 Next steps for validation:')
    console.log('1. Test a few HTML files by opening them directly in your browser')
    console.log('2. Start a local server: `npx serve dist`')
    console.log('3. Test with curl: `curl http://localhost:3000/`')
    console.log('4. Test with Screaming Frog pointed at your local server')
    console.log('5. Deploy and test with Screaming Frog on the live site')
    
  } catch (error) {
    console.error('❌ Prerendering failed:', error)
    process.exit(1)
  }
}

// Run the prerendering
main().catch(console.error)