
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

async function buildWithPrerender() {
  console.log('🏗️ Starting complete build with prerendering...')
  
  try {
    // Step 1: Build client
    console.log('📦 Building client bundle...')
    await execAsync('npm run build')
    console.log('✅ Client build completed')
    
    // Step 2: Run prerendering
    console.log('🔄 Starting prerendering...')
    await execAsync('node prerender.js')
    console.log('✅ Prerendering completed')
    
    console.log('🎉 Build with prerendering completed successfully!')
    console.log('📁 Your prerendered site is ready in the dist/ directory')
    
  } catch (error) {
    console.error('❌ Build with prerendering failed:', error)
    process.exit(1)
  }
}

buildWithPrerender()
