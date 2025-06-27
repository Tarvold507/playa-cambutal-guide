
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

function validatePrerenderOutput() {
  console.log('🔍 Validating prerendered output...')
  
  const distPath = toAbsolute('dist')
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist directory not found. Run build first.')
    return false
  }
  
  const testFiles = [
    'index.html',
    'eat.html',
    'stay.html',
    'surf.html',
    'blog.html'
  ]
  
  let validFiles = 0
  
  for (const file of testFiles) {
    const filePath = path.join(distPath, file)
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      console.log(`\n📄 Checking ${file}:`)
      
      // Check for basic structure
      const hasTitle = content.includes('<title>')
      const hasMetaDescription = content.includes('meta name="description"')
      const hasContent = content.length > 5000 // Should be substantial
      const hasAppContent = !content.includes('<!--app-html-->')
      
      console.log(`  📝 Has title: ${hasTitle ? '✅' : '❌'}`)
      console.log(`  📋 Has meta description: ${hasMetaDescription ? '✅' : '❌'}`)
      console.log(`  📏 Content length: ${content.length} chars ${hasContent ? '✅' : '❌'}`)
      console.log(`  🔄 Template replaced: ${hasAppContent ? '✅' : '❌'}`)
      
      if (hasTitle && hasMetaDescription && hasContent && hasAppContent) {
        validFiles++
        console.log(`  ✅ ${file} validation passed`)
      } else {
        console.log(`  ❌ ${file} validation failed`)
      }
    } else {
      console.log(`❌ ${file} not found`)
    }
  }
  
  console.log(`\n📊 Validation Summary:`)
  console.log(`✅ Valid files: ${validFiles}/${testFiles.length}`)
  
  if (validFiles === testFiles.length) {
    console.log('🎉 All prerendered files are valid!')
    console.log('\n🚀 Next steps:')
    console.log('1. Test locally: npx serve dist')
    console.log('2. Test crawling: screaming-frog or curl commands')
    console.log('3. Deploy and verify live site')
    return true
  } else {
    console.log('⚠️ Some files failed validation. Check the output above.')
    return false
  }
}

validatePrerenderOutput()
