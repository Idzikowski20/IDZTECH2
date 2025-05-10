
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
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
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutUs";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import BlogPostEditor from "./pages/BlogPostEditor";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Profile from "./pages/Profile";
import AdminStats from "./pages/AdminStats";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/new-post" element={<BlogPostEditor />} />
          <Route path="/admin/edit-post/:id" element={<BlogPostEditor />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
