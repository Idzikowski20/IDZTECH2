import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/utils/themeContext';
import { AuthProvider } from '@/utils/AuthProvider';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import ContactPage from '@/pages/ContactPage';
import Projects from '@/pages/Projects';
import SeoAudit from '@/pages/SeoAudit';
import LocalSeo from '@/pages/LocalSeo';
import ECommerce from '@/pages/ECommerce';
import WebDevelopment from '@/pages/WebDevelopment';
import SeoCopywriting from '@/pages/SeoCopywriting';
import SeoOptimization from '@/pages/SeoOptimization';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/seo-audit" element={<SeoAudit />} />
            <Route path="/local-seo" element={<LocalSeo />} />
            <Route path="/ecommerce" element={<ECommerce />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/seo-copywriting" element={<SeoCopywriting />} />
            <Route path="/seo-optimization" element={<SeoOptimization />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;