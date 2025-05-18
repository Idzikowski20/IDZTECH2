
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import WebDevelopment from './pages/WebDevelopment';
import EcommerceDevelopment from './pages/EcommerceDevelopment';
import SeoServices from './pages/SeoServices';
import LocalSeo from './pages/LocalSeo';
import SeoAudit from './pages/SeoAudit';
import SeoOptimization from './pages/SeoOptimization';
import SeoCopywriting from './pages/SeoCopywriting';
import ContentPlan from './pages/ContentPlan';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PasswordGenerator from './pages/PasswordGenerator';
import DomainCreator from './pages/DomainCreator';
import NameGenerator from './pages/NameGenerator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LanguageController from './components/LanguageController';

const App = () => {
  return (
    <>
      <LanguageController />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/tworzenie-stron-www" element={<WebDevelopment />} />
        <Route path="/sklepy-internetowe" element={<EcommerceDevelopment />} />
        <Route path="/pozycjonowanie-stron" element={<SeoServices />} />
        <Route path="/pozycjonowanie-lokalne" element={<LocalSeo />} />
        <Route path="/audyt-seo" element={<SeoAudit />} />
        <Route path="/optymalizacja-seo" element={<SeoOptimization />} />
        <Route path="/copywriting-seo" element={<SeoCopywriting />} />
        <Route path="/content-plan" element={<ContentPlan />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/domain-creator" element={<DomainCreator />} />
        <Route path="/name-generator" element={<NameGenerator />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
