import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, '..', p)

export async function buildSSR() {
  try {
    console.log('🔨 Building SSR bundle...')
    process.env.BUILD_SSR = 'true'
    
    // Clean previous SSR build
    const serverDistPath = toAbsolute('dist/server')
    if (fs.existsSync(serverDistPath)) {
      fs.rmSync(serverDistPath, { recursive: true, force: true })
      console.log('🧹 Cleaned previous SSR build')
    }
    
    const { stdout, stderr } = await execAsync('npx vite build', { 
      env: { ...process.env, BUILD_SSR: 'true' } 
    })
    
    if (stderr && !stderr.includes('warnings')) {
      console.warn('⚠️ SSR build warnings:', stderr)
    }
    
    console.log('✅ SSR bundle built successfully')
    
    // Validate SSR output
    const serverEntryPath = toAbsolute('dist/server/entry-server.js')
    if (!fs.existsSync(serverEntryPath)) {
      throw new Error('❌ SSR entry file not found after build')
    }
    
    return true
  } catch (error) {
    console.warn('⚠️ SSR build failed, continuing with client-side rendering:', error.message)
    return false
  }
}

export async function loadServerRenderer() {
  try {
    const serverPath = toAbsolute('dist/server/entry-server.js')
    if (fs.existsSync(serverPath)) {
      console.log('📦 Loading SSR renderer from:', serverPath)
      
      // Clear module cache to ensure fresh import
      delete require.cache[serverPath]
      
      const { render } = await import(serverPath)
      
      // Test the renderer with a simple route
      const testHtml = render('/')
      console.log('🧪 SSR renderer test result length:', testHtml.length)
      
      if (testHtml.length < 50) {
        console.warn('⚠️ SSR renderer returned suspiciously short content')
      }
      
      return render
    }
  } catch (error) {
    console.warn('⚠️ Could not load SSR renderer:', error.message)
  }
  
  console.log('🔄 Using fallback renderer')
  return (url) => {
    console.log(`Using fallback renderer for ${url}`)
    return '<div id="root"><div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div><p class="text-gray-600">Loading Playa Cambutal Guide...</p></div></div></div>'
  }
}