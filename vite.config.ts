
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
  },
  // Configure how static files are handled
  define: {
    // Ensure the build process doesn't interfere with static file serving
  }
}));
