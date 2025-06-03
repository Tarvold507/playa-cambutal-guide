
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Eat from "./pages/Eat";
import Stay from "./pages/Stay";
import Events from "./pages/Events";
import Adventure from "./pages/Adventure";
import Surf from "./pages/Surf";
import Info from "./pages/Info";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDetail from "./pages/RestaurantDetail";
import AddRestaurant from "./pages/AddRestaurant";
import HotelDetail from "./pages/HotelDetail";
import AddHotel from "./pages/AddHotel";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AddBlog from "./pages/AddBlog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/eat" element={<Eat />} />
                <Route path="/eat/:slug" element={<RestaurantDetail />} />
                <Route path="/add-restaurant" element={<AddRestaurant />} />
                <Route path="/stay" element={<Stay />} />
                <Route path="/stay/:slug" element={<HotelDetail />} />
                <Route path="/add-hotel" element={<AddHotel />} />
                <Route path="/events" element={<Events />} />
                <Route path="/adventure" element={<Adventure />} />
                <Route path="/adventure/surf" element={<Surf />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/add-blog" element={<AddBlog />} />
                <Route path="/info" element={<Info />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
