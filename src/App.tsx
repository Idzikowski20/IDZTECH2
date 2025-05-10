
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import BlogPostEditor from "./pages/BlogPostEditor";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Profile from "./pages/Profile";
import AdminStats from "./pages/AdminStats";
import AdminSettings from "./pages/AdminSettings";
import AdminUsers from "./pages/AdminUsers";
import AdminNotifications from "./pages/AdminNotifications";
import { ThemeProvider } from "./utils/themeContext";
import { AuthProvider } from "./utils/AuthProvider";
import { initGA, trackPageView } from "./utils/analytics";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

// Analytics tracking component
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  return null;
};

// Initialize Google Analytics
if (typeof window !== 'undefined') {
  initGA();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AnalyticsTracker />
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
              <Route path="/admin/stats" element={<RequireAuth><AdminStats /></RequireAuth>} />
              <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
              <Route path="/admin/users" element={<RequireAuth><AdminUsers /></RequireAuth>} />
              <Route path="/admin/new-post" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
              <Route path="/admin/edit-post/:id" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
              <Route path="/admin/notifications" element={<RequireAuth><AdminNotifications /></RequireAuth>} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
