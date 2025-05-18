
import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import Blog from "@/pages/Blog";
import BlogPostEditor from "@/pages/BlogPostEditor";
import BlogPost from "@/pages/BlogPost";
import ContactPage from "@/pages/ContactPage";
import AboutUs from "@/pages/AboutUs";
import Projects from "@/pages/Projects";
import WebDevelopment from "@/pages/WebDevelopment";
import ECommerce from "@/pages/ECommerce";
import Seo from "@/pages/Seo";
import LocalSeo from "@/pages/LocalSeo";
import SeoAudit from "@/pages/SeoAudit";
import SeoOptimization from "@/pages/SeoOptimization";
import SeoCopywriting from "@/pages/SeoCopywriting";
import ContentPlan from "@/pages/ContentPlan";
import Error404 from "@/pages/Error404";
import NotFound from "@/pages/NotFound";
import PasswordGenerator from "@/pages/tools/PasswordGenerator";
import PrivacyPolicyGenerator from "@/pages/tools/PrivacyPolicyGenerator";
import DomainNameCreator from "@/pages/tools/DomainNameCreator";
import RequireAuth from "@/components/RequireAuth";
import ErrorPage from '@/pages/ErrorPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfUse from '@/pages/TermsOfUse';
import { trackPageView } from '@/utils/analytics';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: "/blog",
    element: <Blog />
  },
  {
    path: "/blog/new",
    element: (
      <RequireAuth>
        <BlogPostEditor />
      </RequireAuth>
    ),
  },
  {
    path: "/blog/edit/:id",
    element: (
      <RequireAuth>
        <BlogPostEditor />
      </RequireAuth>
    ),
  },
  {
    path: "/blog/:id",
    element: <BlogPost />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "/about",
    element: <AboutUs />
  },
  {
    path: "/projects",
    element: <Projects />
  },
  {
    path: "/tworzenie-stron-www",
    element: <WebDevelopment />
  },
  {
    path: "/sklepy-internetowe",
    element: <ECommerce />
  },
  {
    path: "/pozycjonowanie-stron",
    element: <Seo />
  },
  {
    path: "/pozycjonowanie-lokalne",
    element: <LocalSeo />
  },
  {
    path: "/audyt-seo",
    element: <SeoAudit />
  },
  {
    path: "/optymalizacja-seo",
    element: <SeoOptimization />
  },
  {
    path: "/copywriting-seo",
    element: <SeoCopywriting />
  },
  {
    path: "/content-plan",
    element: <ContentPlan />
  },
  {
    path: "/404",
    element: <Error404 />
  },
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: "/password-generator",
    element: <PasswordGenerator />
  },
  {
    path: "/privacy-policy-generator",
    element: <PrivacyPolicyGenerator />
  },
  {
    path: "/domain-creator",
    element: <DomainNameCreator />
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms",
    element: <TermsOfUse />
  }
]);
