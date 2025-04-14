
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Eat from "./pages/Eat";
import Stay from "./pages/Stay";
import Surf from "./pages/Surf";
import Do from "./pages/Do";
import Transportation from "./pages/Transportation";
import RealEstate from "./pages/RealEstate";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/eat" element={<Eat />} />
          <Route path="/stay" element={<Stay />} />
          <Route path="/surf" element={<Surf />} />
          <Route path="/do" element={<Do />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/real-estate" element={<RealEstate />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
