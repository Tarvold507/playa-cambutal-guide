import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { StaticFileRoutes } from './components/StaticFileRoutes';

// Import existing pages directly (non-lazy for now)
import Index from './pages/Index';
import Do from './pages/Do';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Eat from './pages/Eat';
import Stay from './pages/Stay';
import Auth from './pages/Auth';
import Calendar from './pages/Calendar';
import AddRestaurant from './pages/AddRestaurant';
import AddHotel from './pages/AddHotel';
import MyListings from './pages/MyListings';
import RestaurantDetail from './pages/RestaurantDetail';
import HotelDetail from './pages/HotelDetail';
import BlogPost from './pages/BlogPost';
import Surf from './pages/Surf';
import Transportation from './pages/Transportation';
import RealEstate from './pages/RealEstate';
import Info from './pages/Info';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclosure from './pages/Disclosure';
import NotFound from './pages/NotFound';

// Lazy load heavy components
const LazyAdminDashboard = lazy(() => import('./pages/AdminDashboard'));
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
              {/* Static file routes - must come first */}
              <Route path="/sitemap.xml" element={<StaticFileRoutes />} />
              <Route path="/robots.txt" element={<StaticFileRoutes />} />
              
              <Route path="/" element={<Index />} />
              <Route path="/eat" element={<Eat />} />
              <Route path="/stay" element={<Stay />} />
              <Route path="/do" element={<Do />} />
              <Route path="/surf" element={<Surf />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/transportation" element={<Transportation />} />
              <Route path="/real-estate" element={<RealEstate />} />
              <Route path="/info" element={<Info />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclosure" element={<Disclosure />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/add-restaurant" element={<AddRestaurant />} />
              <Route path="/add-hotel" element={<AddHotel />} />
              
              {/* Detail pages */}
              <Route path="/eat/:restaurantSlug" element={<RestaurantDetail />} />
              <Route path="/stay/:hotelSlug" element={<HotelDetail />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route 
                path="/do/:businessSlug" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyAdventureBusinessDetail />
                  </Suspense>
                } 
              />
              
              {/* Admin dashboard - lazy loaded due to size */}
              <Route 
                path="/admin" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyAdminDashboard />
                  </Suspense>
                } 
              />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
