
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Blog from '@/pages/Blog';
import BlogPostEditor from '@/pages/BlogPostEditor';
import BlogPost from '@/pages/BlogPost';
import ContactPage from '@/pages/ContactPage';
import AboutUs from '@/pages/AboutUs';
import Projects from '@/pages/Projects';
import WebDevelopment from '@/pages/WebDevelopment';
import ECommerce from '@/pages/ECommerce';
import Seo from '@/pages/Seo';
import LocalSeo from '@/pages/LocalSeo';
import SeoAudit from '@/pages/SeoAudit';
import SeoOptimization from '@/pages/SeoOptimization';
import SeoCopywriting from '@/pages/SeoCopywriting';
import ContentPlan from '@/pages/ContentPlan';
import Error404 from '@/pages/Error404';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfUse from '@/pages/TermsOfUse';
import RequireAuth from '@/components/RequireAuth';
import ErrorPage from '@/pages/ErrorPage';
import Admin from '@/pages/Admin';
import { Toaster } from 'sonner';
import AIPostPage from './pages/ai-post';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} errorElement={<ErrorPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tworzenie-stron-www" element={<WebDevelopment />} />
        <Route path="/sklepy-internetowe" element={<ECommerce />} />
        <Route path="/pozycjonowanie-stron" element={<Seo />} />
        <Route path="/pozycjonowanie-lokalne" element={<LocalSeo />} />
        <Route path="/audyt-seo" element={<SeoAudit />} />
        <Route path="/optymalizacja-seo" element={<SeoOptimization />} />
        <Route path="/copywriting-seo" element={<SeoCopywriting />} />
        <Route path="/content-plan" element={<ContentPlan />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        
        {/* Admin routes - protected with RequireAuth */}
        <Route path="/admin/ai-post" element={<RequireAuth><AIPostPage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
        <Route path="/admin/new-post" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
        <Route path="/admin/edit-post/:id" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
