import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure static files from public directory are properly served
  publicDir: 'public',
  build: {
    // Ensure all assets are copied during build
    assetsDir: 'assets',
    copyPublicDir: true,
    // Force static files to be in root for Lovable hosting
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep critical static files in root for direct serving
          if (assetInfo.name === 'sitemap.xml' || 
              assetInfo.name === 'robots.txt' || 
              assetInfo.name === 'favicon.ico') {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Ensure proper MIME types for static files
  define: {
    __STATIC_FILES_BASE__: JSON.stringify('/'),
  }
}));
