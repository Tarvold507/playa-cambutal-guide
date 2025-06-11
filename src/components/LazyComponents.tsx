
import { lazy } from 'react';

// Lazy load heavy components that aren't immediately visible
export const LazyEventCalendar = lazy(() => import('./EventCalendar'));
export const LazyBusinessDirectory = lazy(() => import('./BusinessDirectory'));
export const LazyLocalServices = lazy(() => import('./LocalServices'));
export const LazyCMSFeaturedSections = lazy(() => import('./home/CMSFeaturedSections'));
