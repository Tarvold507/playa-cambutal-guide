import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, '..', p)

export function validateBuildOutput() {
  console.log('🔍 Validating build output...')
  
  const clientDistPath = toAbsolute('dist')
  const serverDistPath = toAbsolute('dist/server')
  const templatePath = toAbsolute('dist/index.html')
  
  console.log(`Checking client build at: ${clientDistPath}`)
  console.log(`Checking server build at: ${serverDistPath}`)
  console.log(`Checking template at: ${templatePath}`)
  
  if (!fs.existsSync(clientDistPath)) {
    throw new Error('❌ Client build not found. Run `npm run build` first.')
  }
  
  if (!fs.existsSync(templatePath)) {
    throw new Error('❌ Template file not found in dist directory.')
  }
  
  const template = fs.readFileSync(templatePath, 'utf-8')
  if (!template.includes('<!--app-html-->')) {
    console.warn('⚠️ Template does not contain <!--app-html--> placeholder. This may cause issues.')
  }
  
  console.log('✅ Build output validation passed')
  return { template, templatePath }
}

export { toAbsolute }