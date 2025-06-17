
# Deployment Configuration Guide

This project requires specific hosting configuration to serve static files (sitemap.xml, robots.txt, favicon.ico) correctly alongside the React SPA.

## Lovable Hosting (Current Setup)

Your project is currently hosted on Lovable with a custom domain (playacambutalguide.com). 

### Static File Handling on Lovable
- Static files from the `public/` directory should be automatically served
- The updated `vite.config.ts` ensures proper build configuration for Lovable
- React-based fallback routes have been added for `sitemap.xml` and `robots.txt` as backup
- If static files don't work directly, the React routes will serve the content

### Testing on Lovable
After deployment, verify these URLs work:
- `https://playacambutalguide.com/sitemap.xml`
- `https://playacambutalguide.com/robots.txt`
- `https://playacambutalguide.com/favicon.ico`

### Troubleshooting Lovable Deployment
1. Check that files exist in the build output after `npm run build`
2. If static files still don't work, contact Lovable support about custom domain static file serving
3. The React fallback routes ensure SEO tools can still access sitemap and robots content

## Platform-Specific Instructions (For Reference)

### Netlify
- The `public/_redirects` file is automatically used
- No additional configuration needed
- Static files will be served before React Router

### Vercel  
- The `vercel.json` file configures routing
- Upload this file to your project root
- Static files will be served directly

### Apache Hosting
- Upload the `public/.htaccess` file to your web root
- Ensure mod_rewrite is enabled
- Proper MIME types will be set automatically

### Nginx
- Add the configuration from `nginx.conf` to your server block
- Adjust paths to match your deployment directory
- Restart Nginx after configuration changes

### Other Hosting Platforms
Make sure your hosting platform is configured to:
1. Serve static files from the public directory directly
2. Fall back to `/index.html` for all other routes (SPA mode)
3. Set proper MIME types for `.xml`, `.txt`, and `.ico` files

## Build Process

The `vite build` command will:
- Copy all files from `public/` to the build output
- Keep static files in the root directory for direct serving
- Generate optimized React application files
- Include fallback React routes for critical static files

## Troubleshooting

If static files still don't work:
1. Check that files exist in your build output
2. Verify your hosting platform configuration
3. Check browser network tab for 404 errors
4. Ensure MIME types are set correctly
5. For Lovable hosting, contact support if needed - the React fallbacks should work as a temporary solution
