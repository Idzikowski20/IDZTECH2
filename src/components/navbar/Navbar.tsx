
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import Brand from './Brand';
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import DesktopControls from './DesktopControls';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

// Meta data configuration for all pages
const metaConfig: Record<string, { title: string; description: string; keywords: string }> = {
  '/': {
    title: 'IDZ.TECH - Profesjonalne Tworzenie Stron WWW i Aplikacji Webowych',
    description: 'Tworzymy nowoczesne strony internetowe, aplikacje webowe i sklepy online. Oferujemy kompleksowe usługi SEO, które zwiększą widoczność Twojego biznesu w internecie.',
    keywords: 'tworzenie stron www, strony internetowe, aplikacje webowe, SEO, pozycjonowanie'
  },
  '/about': {
    title: 'O nas | IDZ.TECH - Zespół Profesjonalistów Web Development',
    description: 'Poznaj zespół IDZ.TECH - specjalistów od tworzenia stron internetowych, SEO i marketingu cyfrowego z wieloletnim doświadczeniem.',
    keywords: 'IDZ.TECH zespół, specjaliści web development, agencja interaktywna, projektowanie stron'
  },
  '/contact': {
    title: 'Kontakt | IDZ.TECH - Zamów Darmową Konsultację',
    description: 'Skontaktuj się z IDZ.TECH i zamów darmową konsultację. Porozmawiajmy o Twoim projekcie internetowym i możliwościach współpracy.',
    keywords: 'kontakt IDZ.TECH, darmowa konsultacja, wycena strony www, agencja interaktywna kontakt'
  },
  '/projects': {
    title: 'Realizacje | IDZ.TECH - Nasze Portfolio Stron WWW i Aplikacji',
    description: 'Zobacz nasze portfolio i przekonaj się, jak pomagamy firmom budować swoją obecność online poprzez nowoczesne strony internetowe i aplikacje.',
    keywords: 'portfolio stron www, realizacje web development, case study, projekty stron internetowych'
  },
  '/tworzenie-stron-www': {
    title: 'Tworzenie Stron Internetowych | IDZ.TECH - Profesjonalne Strony WWW',
    description: 'Tworzymy responsywne, szybkie i przyjazne dla użytkownika strony internetowe, które pomogą Ci osiągnąć cele biznesowe.',
    keywords: 'tworzenie stron www, strony internetowe, projektowanie stron, responsywne strony'
  },
  '/pozycjonowanie-stron': {
    title: 'Pozycjonowanie Stron | IDZ.TECH - Skuteczne SEO',
    description: 'Oferujemy profesjonalne usługi pozycjonowania stron internetowych, które zwiększą widoczność Twojej witryny w wyszukiwarkach.',
    keywords: 'pozycjonowanie stron, SEO, optymalizacja, widoczność w Google'
  },
  '/audyt-seo': {
    title: 'Audyt SEO | IDZ.TECH - Kompleksowa Analiza Twojej Strony',
    description: 'Przeprowadzimy szczegółowy audyt SEO Twojej strony, który wskaże słabe punkty i pozwoli na skuteczną optymalizację.',
    keywords: 'audyt SEO, analiza strony, optymalizacja SEO, raport SEO'
  },
  '/copywriting-seo': {
    title: 'Copywriting SEO | IDZ.TECH - Treści Przyjazne Wyszukiwarkom',
    description: 'Tworzymy unikalne i angażujące treści, które podobają się zarówno użytkownikom, jak i wyszukiwarkom internetowym.',
    keywords: 'copywriting SEO, pisanie tekstów, content marketing, treści na stronę'
  },
  '/optymalizacja-seo': {
    title: 'Optymalizacja SEO | IDZ.TECH - Techniczne SEO dla Twojej Strony',
    description: 'Kompleksowa optymalizacja techniczna Twojej strony internetowej pod kątem wyszukiwarek, która poprawi jej ranking i wydajność.',
    keywords: 'optymalizacja SEO, techniczne SEO, szybkość strony, mobile friendly'
  },
  '/pozycjonowanie-lokalne': {
    title: 'Pozycjonowanie Lokalne | IDZ.TECH - SEO dla Firm Lokalnych',
    description: 'Specjalistyczne pozycjonowanie dla firm lokalnych, które pomoże Ci dotrzeć do klientów w Twojej okolicy.',
    keywords: 'pozycjonowanie lokalne, local SEO, Google Maps, wizytówka Google'
  },
  '/sklepy-internetowe': {
    title: 'Sklepy Internetowe | IDZ.TECH - Profesjonalne E-commerce',
    description: 'Tworzymy funkcjonalne i estetyczne sklepy internetowe, które zwiększają sprzedaż i zapewniają doskonałe doświadczenie zakupowe.',
    keywords: 'sklep internetowy, e-commerce, woocommerce, PrestaShop, sprzedaż online'
  },
  '/audyt-google-ads': {
    title: 'Audyt Google Ads | IDZ.TECH - Analiza Kampanii Reklamowych',
    description: 'Profesjonalny audyt Twoich kampanii Google Ads, który pomoże zoptymalizować wydatki i zwiększyć ich efektywność.',
    keywords: 'audyt Google Ads, analiza kampanii, optymalizacja reklam, ROI'
  },
  '/kampanie-google-ads': {
    title: 'Kampanie Google Ads | IDZ.TECH - Skuteczne Reklamy',
    description: 'Prowadzimy skuteczne kampanie Google Ads, które generują ruch i konwersje dla Twojego biznesu.',
    keywords: 'kampanie Google Ads, reklama Google, PPC, reklama w wyszukiwarce'
  },
  '/kampanie-meta-ads': {
    title: 'Kampanie Meta Ads | IDZ.TECH - Reklamy na Facebooku i Instagramie',
    description: 'Tworzymy i zarządzamy skutecznymi kampaniami reklamowymi na platformach Meta, docierając do Twojej grupy docelowej.',
    keywords: 'reklamy Facebook, Meta Ads, Instagram Ads, social media marketing'
  },
  '/blog': {
    title: 'Blog | IDZ.TECH - Wiedza o Web Development i SEO',
    description: 'Praktyczne porady, tutoriale i aktualności ze świata tworzenia stron internetowych, SEO i marketingu cyfrowego.',
    keywords: 'blog o stronach www, porady SEO, web development blog, marketing cyfrowy'
  }
};

// Default meta for pages not explicitly defined
const defaultMeta = {
  title: 'IDZ.TECH - Profesjonalne Usługi Web Development i SEO',
  description: 'Kompleksowe usługi związane z tworzeniem stron internetowych, pozycjonowaniem i marketingiem cyfrowym dla firm każdej wielkości.',
  keywords: 'strony www, SEO, pozycjonowanie, web development, marketing cyfrowy'
};

const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Get meta data for current page or use default if not defined
  const currentPath = location.pathname;
  const meta = metaConfig[currentPath] || defaultMeta;
  
  // Add scroll event listener to track when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={`https://www.idz.tech${currentPath}`} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {/* WCAG improvements - language and viewport */}
        <html lang="pl" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
          scrolled 
            ? "bg-black/80 dark:bg-black/80 backdrop-blur-lg shadow-lg" 
            : "bg-transparent"
        )}
        role="banner"
        aria-label="Główna nawigacja witryny"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Brand />
            
            <nav 
              className="hidden md:flex md:items-center md:justify-center md:flex-1"
              role="navigation" 
              aria-label="Menu główne"
            >
              <DesktopNavigation />
            </nav>
            
            <DesktopControls />
            <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
