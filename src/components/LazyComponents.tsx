
import { lazy } from 'react';

// Lazy load heavy components that aren't immediately visible
export const LazyEventCalendar = lazy(() => import('./EventCalendar'));
export const LazyBusinessDirectory = lazy(() => import('./BusinessDirectory'));
export const LazyLocalServices = lazy(() => import('./LocalServices'));
export const LazyCMSFeaturedSections = lazy(() => import('./home/CMSFeaturedSections'));
export const LazyAdventureBusinessDetail = lazy(() => import('../pages/AdventureBusinessDetail'));

// Simple loading component for lazy components
export const LazyLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venao mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);
