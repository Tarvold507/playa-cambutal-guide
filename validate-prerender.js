
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const validateHTML = (filePath, route) => {
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const errors = [];
  const warnings = [];
  
  // Check for required meta tags
  const title = document.querySelector('title');
  if (!title || !title.textContent.trim()) {
    errors.push(`Missing or empty title tag for ${route}`);
  }
  
  const description = document.querySelector('meta[name="description"]');
  if (!description || !description.getAttribute('content')) {
    errors.push(`Missing meta description for ${route}`);
  }
  
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical || !canonical.getAttribute('href')) {
    warnings.push(`Missing canonical URL for ${route}`);
  }
  
  // Check Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  
  if (!ogTitle) warnings.push(`Missing og:title for ${route}`);
  if (!ogDescription) warnings.push(`Missing og:description for ${route}`);
  if (!ogImage) warnings.push(`Missing og:image for ${route}`);
  
  // Check for structured data
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (!structuredData && route !== '/') {
    warnings.push(`Missing structured data for ${route}`);
  }
  
  return { errors, warnings };
};

const validatePrerender = () => {
  console.log('🔍 Validating prerendered HTML files...');
  
  const distDir = './dist';
  let totalErrors = 0;
  let totalWarnings = 0;
  
  const validateFile = (filePath, route) => {
    if (fs.existsSync(filePath)) {
      const { errors, warnings } = validateHTML(filePath, route);
      
      if (errors.length > 0) {
        console.log(`❌ Errors in ${route}:`);
        errors.forEach(error => console.log(`   ${error}`));
        totalErrors += errors.length;
      }
      
      if (warnings.length > 0) {
        console.log(`⚠️ Warnings in ${route}:`);
        warnings.forEach(warning => console.log(`   ${warning}`));
        totalWarnings += warnings.length;
      }
      
      if (errors.length === 0 && warnings.length === 0) {
        console.log(`✅ ${route} - SEO validation passed`);
      }
    } else {
      console.log(`❌ File not found: ${filePath}`);
      totalErrors++;
    }
  };
  
  // Validate static routes
  const staticRoutes = [
    '/',
    '/eat',
    '/stay',
    '/do',
    '/surf',
    '/blog',
    '/info',
    '/transportation',
    '/real-estate'
  ];
  
  staticRoutes.forEach(route => {
    const fileName = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    const filePath = path.join(distDir, fileName);
    validateFile(filePath, route);
  });
  
  // Check for dynamic routes
  const dynamicDirs = ['stay', 'eat'];
  dynamicDirs.forEach(dir => {
    const dirPath = path.join(distDir, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (file.endsWith('.html')) {
          const route = `/${dir}/${file.replace('.html', '')}`;
          const filePath = path.join(dirPath, file);
          validateFile(filePath, route);
        }
      });
    }
  });
  
  // Validate sitemap and robots
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  const robotsPath = path.join(distDir, 'robots.txt');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('⚠️ Missing sitemap.xml');
    totalWarnings++;
  } else {
    console.log('✅ sitemap.xml found');
  }
  
  if (!fs.existsSync(robotsPath)) {
    console.log('⚠️ Missing robots.txt');
    totalWarnings++;
  } else {
    console.log('✅ robots.txt found');
  }
  
  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Warnings: ${totalWarnings}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ SEO validation failed with errors');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️ SEO validation completed with warnings');
  } else {
    console.log('\n✅ All SEO validations passed!');
  }
};

validatePrerender();
