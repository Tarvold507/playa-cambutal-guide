import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { QueryClient } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Restaurants from './pages/Restaurants';
import Hotels from './pages/Hotels';
import Do from './pages/Do';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import { LazyLoading } from './components/LazyComponents';

const LazyHome = lazy(() => import('./pages/Home'));
const LazyAbout = lazy(() => import('./pages/About'));
const LazyContact = lazy(() => import('./pages/Contact'));
const LazyEvents = lazy(() => import('./pages/Events'));
const LazyRestaurants = lazy(() => import('./pages/Restaurants'));
const LazyHotels = lazy(() => import('./pages/Hotels'));
const LazyDo = lazy(() => import('./pages/Do'));
const LazyBlog = lazy(() => import('./pages/Blog'));
const LazyAdmin = lazy(() => import('./pages/Admin'));
const LazyProfile = lazy(() => import('./pages/Profile'));
export const LazyAdventureBusinessDetail = lazy(() => import('./pages/AdventureBusinessDetail'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <QueryClient>
            <Toaster />
            <Routes>
              <Route path="/" element={<Suspense fallback={<LazyLoading />}><LazyHome /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={<LazyLoading />}><LazyAbout /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<LazyLoading />}><LazyContact /></Suspense>} />
              <Route path="/events" element={<Suspense fallback={<LazyLoading />}><LazyEvents /></Suspense>} />
              <Route path="/restaurants" element={<Suspense fallback={<LazyLoading />}><LazyRestaurants /></Suspense>} />
              <Route path="/hotels" element={<Suspense fallback={<LazyLoading />}><LazyHotels /></Suspense>} />
              <Route path="/do" element={<Suspense fallback={<LazyLoading />}><LazyDo /></Suspense>} />
              <Route path="/blog" element={<Suspense fallback={<LazyLoading />}><LazyBlog /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={<LazyLoading />}><LazyAdmin /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<LazyLoading />}><LazyProfile /></Suspense>} />
              <Route path="/do/:businessSlug" element={<LazyAdventureBusinessDetail />} />
            </Routes>
          </QueryClient>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
