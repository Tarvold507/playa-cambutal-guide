
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

async function deployPrerendered() {
  console.log('🚀 Starting deployment of prerendered site...')
  
  try {
    // Validate that prerendered files exist
    const distPath = path.join(__dirname, 'dist')
    if (!fs.existsSync(distPath)) {
      throw new Error('❌ Dist directory not found. Run prerendering first.')
    }
    
    const indexPath = path.join(distPath, 'index.html')
    if (!fs.existsSync(indexPath)) {
      throw new Error('❌ Index.html not found in dist directory.')
    }
    
    console.log('✅ Prerendered files validated')
    
    // Count prerendered files
    const htmlFiles = fs.readdirSync(distPath, { recursive: true })
      .filter(file => file.toString().endsWith('.html'))
    
    console.log(`📊 Found ${htmlFiles.length} HTML files for deployment`)
    
    // Log deployment info
    console.log('\n📋 Deployment Summary:')
    console.log(`📁 Build directory: ${distPath}`)
    console.log(`📄 HTML files: ${htmlFiles.length}`)
    console.log(`📦 Total files: ${fs.readdirSync(distPath, { recursive: true }).length}`)
    
    // Validate critical files
    const criticalFiles = ['index.html', 'sitemap.xml', 'robots.txt']
    const foundFiles = []
    const missingFiles = []
    
    for (const file of criticalFiles) {
      const filePath = path.join(distPath, file)
      if (fs.existsSync(filePath)) {
        foundFiles.push(file)
      } else {
        missingFiles.push(file)
      }
    }
    
    console.log(`✅ Found critical files: ${foundFiles.join(', ')}`)
    if (missingFiles.length > 0) {
      console.log(`⚠️ Missing files: ${missingFiles.join(', ')}`)
    }
    
    // Check for dynamic routes
    const dynamicRoutes = htmlFiles.filter(file => 
      file.toString().includes('/stay/') || 
      file.toString().includes('/eat/') || 
      file.toString().includes('/blog/')
    )
    
    console.log(`🔗 Dynamic routes: ${dynamicRoutes.length}`)
    
    // Validate SEO data in random files
    console.log('\n🔍 SEO Validation:')
    const sampleFiles = htmlFiles.slice(0, 3)
    for (const file of sampleFiles) {
      const filePath = path.join(distPath, file.toString())
      const content = fs.readFileSync(filePath, 'utf-8')
      
      const hasTitle = content.includes('<title>') && !content.includes('<title>Vite + React + TS</title>')
      const hasMeta = content.includes('<meta name="description"')
      const hasOG = content.includes('<meta property="og:title"')
      
      console.log(`  ${file}: ${hasTitle ? '✅' : '❌'} Title, ${hasMeta ? '✅' : '❌'} Meta, ${hasOG ? '✅' : '❌'} OG`)
    }
    
    console.log('\n🎉 Deployment preparation complete!')
    console.log('📤 Files are ready for GitHub Pages deployment')
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployPrerendered()
}

export default deployPrerendered
