
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '@/utils/AuthProvider';
import RequireAuth from '@/components/RequireAuth';

// Import components and pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import AdminStats from '@/pages/AdminStats';
import AdminUsers from '@/pages/AdminUsers';
import AdminCMS from '@/pages/AdminCMS';
import AdminNotifications from '@/pages/AdminNotifications';
import AdminSettings from '@/pages/AdminSettings';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import BlogPostEditor from '@/pages/BlogPostEditor';
import Seo from '@/pages/Seo';
import SeoAudit from '@/pages/SeoAudit';
import SeoOptimization from '@/pages/SeoOptimization';
import SeoCopywriting from '@/pages/SeoCopywriting';
import LocalSeo from '@/pages/LocalSeo';
import GoogleAdsCampaigns from '@/pages/GoogleAdsCampaigns';
import MetaAdsCampaigns from '@/pages/MetaAdsCampaigns';
import GoogleAdsAudit from '@/pages/GoogleAdsAudit';
import ECommerce from '@/pages/ECommerce';
import WebDevelopment from '@/pages/WebDevelopment';
import ContentPlan from '@/pages/ContentPlan';
import AboutUs from '@/pages/AboutUs';
import Projects from '@/pages/Projects';
import ContactPage from '@/pages/ContactPage';
import Error404 from '@/pages/Error404';
import NotFound from '@/pages/NotFound';
import ScrollToTop from '@/components/ScrollToTop';
import VisualCMSEditor from '@/pages/VisualCMSEditor';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Visual Editor Route */}
        <Route 
          path="/visual-editor" 
          element={
            <RequireAuth>
              <VisualCMSEditor />
            </RequireAuth>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/stats" 
          element={
            <RequireAuth>
              <AdminStats />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <RequireAuth>
              <AdminUsers />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/cms" 
          element={
            <RequireAuth>
              <AdminCMS />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/notifications" 
          element={
            <RequireAuth>
              <AdminNotifications />
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <RequireAuth>
              <AdminSettings />
            </RequireAuth>
          } 
        />
        
        {/* User Routes */}
        <Route 
          path="/profile" 
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } 
        />
        
        {/* Content Routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/post/:id" element={<BlogPost />} />
        <Route 
          path="/blog/editor" 
          element={
            <RequireAuth>
              <BlogPostEditor />
            </RequireAuth>
          } 
        />
        <Route 
          path="/blog/editor/:id" 
          element={
            <RequireAuth>
              <BlogPostEditor />
            </RequireAuth>
          } 
        />
        
        {/* Service Routes */}
        <Route path="/uslugi/seo" element={<Seo />} />
        <Route path="/uslugi/seo/audyt-seo" element={<SeoAudit />} />
        <Route path="/uslugi/seo/optymalizacja" element={<SeoOptimization />} />
        <Route path="/uslugi/seo/copywriting" element={<SeoCopywriting />} />
        <Route path="/uslugi/seo/lokalne" element={<LocalSeo />} />
        <Route path="/uslugi/kampanie-google-ads" element={<GoogleAdsCampaigns />} />
        <Route path="/uslugi/kampanie-meta-ads" element={<MetaAdsCampaigns />} />
        <Route path="/uslugi/audyt-google-ads" element={<GoogleAdsAudit />} />
        <Route path="/uslugi/e-commerce" element={<ECommerce />} />
        <Route path="/uslugi/tworzenie-stron" element={<WebDevelopment />} />
        <Route path="/uslugi/plan-tresci" element={<ContentPlan />} />
        
        {/* Static Pages */}
        <Route path="/o-nas" element={<AboutUs />} />
        <Route path="/projekty" element={<Projects />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <ScrollToTop />
    </BrowserRouter>
  );
};

export default App;
