
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WebDevelopment from "./pages/WebDevelopment";
import ECommerce from "./pages/ECommerce";
import Seo from "./pages/Seo";
import LocalSeo from "./pages/LocalSeo";
import SeoAudit from "./pages/SeoAudit";
import SeoOptimization from "./pages/SeoOptimization";
import SeoCopywriting from "./pages/SeoCopywriting";
import ContentPlan from "./pages/ContentPlan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tworzenie-stron-www" element={<WebDevelopment />} />
          <Route path="/tworzenie-sklepow-internetowych" element={<ECommerce />} />
          <Route path="/pozycjonowanie-stron-internetowych" element={<Seo />} />
          <Route path="/pozycjonowanie-lokalne" element={<LocalSeo />} />
          <Route path="/audyt-seo" element={<SeoAudit />} />
          <Route path="/optymalizacja-seo" element={<SeoOptimization />} />
          <Route path="/copywriting-seo" element={<SeoCopywriting />} />
          <Route path="/content-plan" element={<ContentPlan />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
