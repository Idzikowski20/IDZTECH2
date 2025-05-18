
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/utils/themeContext";
import { UIToaster } from "@/components/ui/toaster";
import { AuthProvider } from "./utils/AuthProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { UserProfile } from './components/user/UserProfile';
import { useUsers } from './hooks/useUsers';
import AdminLayout from './components/AdminLayout';
import LanguageController from './components/LanguageController';

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

// Tool Pages
import PasswordGenerator from './pages/tools/PasswordGenerator';
import PrivacyPolicyGenerator from './pages/tools/PrivacyPolicyGenerator';
import DomainNameCreator from './pages/tools/DomainNameCreator';

// Blog
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogPostEditor from './pages/BlogPostEditor';

// Components
import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ScrollToTop';
import DotAnimation from './components/DotAnimation';

// Konfiguracja QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// Komponent chroniący ścieżki admina
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoadingCurrentUser } = useUsers();
  if (isLoadingCurrentUser) return null;
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <ScrollToTop />
              <LanguageController />
              <DotAnimation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
                <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
                <Route path="/admin/stats" element={<RequireAuth><AdminStats /></RequireAuth>} />
                <Route path="/admin/users" element={<RequireAuth requiredRole="admin"><AdminUsers /></RequireAuth>} />
                <Route path="/admin/new-post" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
                <Route path="/admin/edit-post/:id" element={<RequireAuth><BlogPostEditor /></RequireAuth>} />
                <Route path="/content-plan" element={<RequireAuth><ContentPlan /></RequireAuth>} />
                <Route path="/tworzenie-stron-www" element={<WebDevelopment />} />
                <Route path="/pozycjonowanie-stron" element={<Seo />} />
                <Route path="/audyt-seo" element={<SeoAudit />} />
                <Route path="/copywriting-seo" element={<SeoCopywriting />} />
                <Route path="/optymalizacja-seo" element={<SeoOptimization />} />
                <Route path="/pozycjonowanie-lokalne" element={<LocalSeo />} />
                <Route path="/sklepy-internetowe" element={<ECommerce />} />
                {/* Tool Pages */}
                <Route path="/password-generator" element={<PasswordGenerator />} />
                <Route path="/privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
                <Route path="/domain-creator" element={<DomainNameCreator />} />
                {/* Blog */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
                {/* Panel bloga - uproszczony admin */}
                <Route
                  path="/admin/blog/new"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        {/* Formularz dodawania posta do bloga (do zaimplementowania) */}
                        {/* <BlogPostForm /> */}
                        <div className="text-center text-premium-light/70 py-12">Formularz dodawania posta będzie dostępny wkrótce.</div>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/:id"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        {/* Formularz edycji posta do bloga (do zaimplementowania) */}
                        {/* <BlogPostForm /> */}
                        <div className="text-center text-premium-light/70 py-12">Formularz edycji posta będzie dostępny wkrótce.</div>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <UserProfile />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Przekierowania */}
                <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
              </Routes>
              <UIToaster />
            </AuthProvider>
          </ThemeProvider>
          <Toaster />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
