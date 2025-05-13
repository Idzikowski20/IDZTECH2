
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/utils/themeContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./utils/AuthProvider";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Create a loading spinner component for Suspense fallback
const LoadingFallback = () => <LoadingSpinner />;

// Lazily load pages to improve initial loading performance
const Index = lazy(() => import('./pages/Index'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminStats = lazy(() => import('./pages/AdminStats'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'));
const Projects = lazy(() => import('./pages/Projects'));
const ContentPlan = lazy(() => import('./pages/ContentPlan'));

// Service Pages
const WebDevelopment = lazy(() => import('./pages/WebDevelopment'));
const Seo = lazy(() => import('./pages/Seo'));
const SeoAudit = lazy(() => import('./pages/SeoAudit'));
const SeoCopywriting = lazy(() => import('./pages/SeoCopywriting'));
const SeoOptimization = lazy(() => import('./pages/SeoOptimization'));
const LocalSeo = lazy(() => import('./pages/LocalSeo'));
const ECommerce = lazy(() => import('./pages/ECommerce'));
const GoogleAdsAudit = lazy(() => import('./pages/GoogleAdsAudit'));
const GoogleAdsCampaigns = lazy(() => import('./pages/GoogleAdsCampaigns'));
const MetaAdsCampaigns = lazy(() => import('./pages/MetaAdsCampaigns'));

// Blog
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogPostEditor = lazy(() => import('./pages/BlogPostEditor'));

// Components
const RequireAuth = lazy(() => import('./components/RequireAuth'));
const ScrollToTop = lazy(() => import('./components/ScrollToTop'));
const DotAnimation = lazy(() => import('./components/DotAnimation'));

function App() {
  // Set Polish language as default
  useEffect(() => {
    document.documentElement.lang = 'pl';
    document.title = 'IDZ.TECH - Kompleksowe rozwiązania internetowe';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'IDZ.TECH - Tworzenie stron www, pozycjonowanie, sklepy internetowe i wiele więcej.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'IDZ.TECH - Tworzenie stron www, pozycjonowanie, sklepy internetowe i wiele więcej.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <ScrollToTop />
          <DotAnimation />
          <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/profile" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><Profile /></RequireAuth>
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><Admin /></RequireAuth>
                </Suspense>
              } />
              <Route path="/admin/settings" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><AdminSettings /></RequireAuth>
                </Suspense>
              } />
              <Route path="/admin/stats" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><AdminStats /></RequireAuth>
                </Suspense>
              } />
              <Route path="/admin/users" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><AdminUsers /></RequireAuth>
                </Suspense>
              } />
              <Route path="/admin/notifications" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><AdminNotifications /></RequireAuth>
                </Suspense>
              } />
              
              {/* Blog post editor routes */}
              <Route path="/admin/new-post" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><BlogPostEditor /></RequireAuth>
                </Suspense>
              } />
              <Route path="/admin/edit-post/:id" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><BlogPostEditor /></RequireAuth>
                </Suspense>
              } />
              
              <Route path="/content-plan" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RequireAuth><ContentPlan /></RequireAuth>
                </Suspense>
              } />

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
          </Suspense>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
