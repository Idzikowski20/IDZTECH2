
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/utils/themeContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./utils/AuthContext"; // Make sure we use the correct import path

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
    <Router>
      <AuthProvider>
        <ThemeProvider>
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
            
            {/* Portfolio/Projects page accessible without auth */}
            <Route path="/projects" element={<Projects />} />

            {/* Protected routes */}
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
            <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
            <Route path="/admin/stats" element={<RequireAuth><AdminStats /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth requiredRole="admin"><AdminUsers /></RequireAuth>} />
            <Route path="/admin/notifications" element={<RequireAuth><AdminNotifications /></RequireAuth>} />
            
            {/* Blog post editor routes */}
            <Route path="/admin/new-post" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
            <Route path="/admin/edit-post/:id" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
            
            <Route path="/content-plan" element={<RequireAuth><ContentPlan /></RequireAuth>} />

            {/* Service pages */}
            <Route path="/tworzenie-stron-www" element={<WebDevelopment />} />
            <Route path="/pozycjonowanie-stron" element={<Seo />} />
            <Route path="/audyt-seo" element={<SeoAudit />} />
            <Route path="/copywriting-seo" element={<SeoCopywriting />} />
            <Route path="/optymalizacja-seo" element={<SeoOptimization />} />
            <Route path="/pozycjonowanie-lokalne" element={<LocalSeo />} />
            <Route path="/sklepy-internetowe" element={<ECommerce />} />

            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
