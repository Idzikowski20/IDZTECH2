
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/utils/themeContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./utils/AuthProvider";

// Pages
import Index from './pages/Index';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import ContactPage from './pages/ContactPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminSettings from './pages/AdminSettings';
import AdminStats from './pages/AdminStats';
import AdminUsers from './pages/AdminUsers';
import AdminNotifications from "./pages/AdminNotifications";
import Projects from './pages/Projects';
import ContentPlan from './pages/ContentPlan';

// Service Pages
import WebDevelopment from './pages/WebDevelopment';
import Seo from './pages/Seo';
import SeoAudit from './pages/SeoAudit';
import SeoCopywriting from './pages/SeoCopywriting';
import SeoOptimization from './pages/SeoOptimization';
import LocalSeo from './pages/LocalSeo';
import ECommerce from './pages/ECommerce';
import GoogleAdsAudit from './pages/GoogleAdsAudit';
import GoogleAdsCampaigns from './pages/GoogleAdsCampaigns';
import MetaAdsCampaigns from './pages/MetaAdsCampaigns';

// Blog
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogPostEditor from './pages/BlogPostEditor';

// Components
import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ScrollToTop';
import DotAnimation from './components/DotAnimation';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <DotAnimation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/blog/new" element={<BlogPostEditor />} />
              <Route path="/admin/blog/edit/:id" element={<BlogPostEditor />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/content-plan" element={<ContentPlan />} />
            </Route>

            {/* Service pages */}
            <Route path="/tworzenie-stron-www" element={<WebDevelopment />} />
            <Route path="/pozycjonowanie-stron" element={<Seo />} />
            <Route path="/audyt-seo" element={<SeoAudit />} />
            <Route path="/copywriting-seo" element={<SeoCopywriting />} />
            <Route path="/optymalizacja-seo" element={<SeoOptimization />} />
            <Route path="/pozycjonowanie-lokalne" element={<LocalSeo />} />
            <Route path="/sklepy-internetowe" element={<ECommerce />} />
            <Route path="/audyt-google-ads" element={<GoogleAdsAudit />} />
            <Route path="/kampanie-google-ads" element={<GoogleAdsCampaigns />} />
            <Route path="/kampanie-meta-ads" element={<MetaAdsCampaigns />} />

            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
