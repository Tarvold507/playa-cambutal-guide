
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';

// Import existing pages directly (non-lazy for now)
import Index from './pages/Index';
import Do from './pages/Do';
import Blog from './pages/Blog';
import Profile from './pages/Profile';

// Lazy load the adventure business detail page
const LazyAdventureBusinessDetail = lazy(() => import('./pages/AdventureBusinessDetail'));

// Create a query client
const queryClient = new QueryClient();

// Simple loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venao mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/do" element={<Do />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/do/:businessSlug" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyAdventureBusinessDetail />
                  </Suspense>
                } 
              />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
