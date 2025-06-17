
# Deployment Configuration Guide

This project requires specific hosting configuration to serve static files (sitemap.xml, robots.txt, favicon.ico) correctly alongside the React SPA.

## Platform-Specific Instructions

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

## Testing After Deployment

Verify these URLs work correctly:
- `https://your-domain.com/sitemap.xml` (should return XML content)
- `https://your-domain.com/robots.txt` (should return text content)  
- `https://your-domain.com/favicon.ico` (should return favicon)

## Build Process

The `vite build` command will:
- Copy all files from `public/` to the build output
- Keep static files in the root directory for direct serving
- Generate optimized React application files

## Troubleshooting

If static files still don't work:
1. Check that files exist in your build output
2. Verify your hosting platform configuration
3. Check browser network tab for 404 errors
4. Ensure MIME types are set correctly
