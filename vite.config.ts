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
    // Ensure static files are not processed as modules
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep static files in root for direct serving
          if (assetInfo.name === 'sitemap.xml' || assetInfo.name === 'robots.txt' || assetInfo.name === 'favicon.ico') {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Configure how static files are handled
  define: {
    // Ensure the build process doesn't interfere with static file serving
  }
}));
