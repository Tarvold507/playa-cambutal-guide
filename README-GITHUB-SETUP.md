
# GitHub CI/CD Setup Guide

This guide will help you set up the GitHub Actions workflow for automated prerendering and deployment.

## 🚀 Quick Setup

### 1. GitHub Secrets Configuration

You need to add these secrets to your GitHub repository:

**Go to:** Your Repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

```
VITE_SUPABASE_URL=https://yxsnoncplnzekfwaknxb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Enable GitHub Pages

**Go to:** Your Repository → Settings → Pages

**Configure:**
- Source: GitHub Actions
- No need to select a branch (the workflow handles deployment)

### 3. Trigger the Workflow

The workflow will automatically run when you:
- Push to the main branch
- Create a pull request to main

You can also manually trigger it:
- Go to Actions tab → Select "Build and Deploy Prerendered Site" → Run workflow

## 🔧 What the Workflow Does

### Build Process
1. **Install Dependencies** - `npm ci`
2. **Build Client** - `npm run build` (creates the React app)
3. **Build SSR Bundle** - `BUILD_SSR=true npx vite build` (creates server-side rendering)
4. **Run Prerendering** - `node prerender.js` (generates static HTML files)

### Prerendering Features
- **Static Routes**: /, /eat, /stay, /do, /surf, /blog, etc.
- **Dynamic Routes**: Hotel pages, restaurant pages, blog posts
- **SEO Enhancement**: Proper meta tags, Open Graph, structured data
- **Performance**: Pre-generated HTML for faster loading

### Deployment
- **GitHub Pages**: Automatically deploys to `https://yourusername.github.io/yourrepo`
- **Custom Domain**: Can be configured in Pages settings

## 🔍 Monitoring

### Check Workflow Status
- Go to Actions tab to see build status
- Green checkmark = successful deployment
- Red X = build failed (check logs)

### Validate Deployment
After successful deployment, test these URLs:
- `https://yourusername.github.io/yourrepo/` (homepage)
- `https://yourusername.github.io/yourrepo/eat` (restaurants)
- `https://yourusername.github.io/yourrepo/stay/villa-cambutal` (dynamic hotel page)

### SEO Validation
The workflow includes SEO checks:
- Title tags presence
- Meta descriptions
- Sitemap.xml existence
- Robots.txt existence
- Structured data validation

## 🛠️ Troubleshooting

### Common Issues

**Build Fails:**
- Check if all GitHub secrets are set correctly
- Verify Supabase keys are valid
- Check the Actions logs for specific errors

**Prerendering Fails:**
- Database connection issues (check service role key)
- Missing dynamic content (check Supabase data)
- Memory issues (the workflow has sufficient resources)

**Pages Not Deploying:**
- Ensure GitHub Pages is enabled
- Check if the `dist/` directory contains files
- Verify repository permissions

### Debug Steps
1. Check Actions tab for detailed logs
2. Look for red X marks in the workflow steps
3. Verify all secrets are set in repository settings
4. Test prerendering locally: `node prerender.js`

## 📊 Expected Results

After successful setup:
- **Fast Loading**: Pre-generated HTML loads instantly
- **SEO Optimized**: Each page has specific meta tags
- **Social Media**: Proper Open Graph tags for sharing
- **Search Engines**: Crawler-friendly static HTML
- **Performance**: Improved Core Web Vitals scores

## 🔄 Continuous Deployment

Every time you push changes to main:
1. Workflow automatically runs
2. Site rebuilds with latest content
3. New prerendered pages deploy
4. SEO data updates automatically

This ensures your site always has the latest content with optimal SEO!
