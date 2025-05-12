import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Phone, Check, ChevronRight, Search, Globe, Users, TrendingUp, UserCheck, ShieldCheck, BarChart3, Clock, Target, Database, ScrollText, Sparkles, FileText, Link as LinkIcon, Palette, Type, Rocket, LockIcon, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';
import { useTheme } from '@/utils/themeContext';
import HoverableSteps from '@/components/HoverableSteps';
import { Helmet } from 'react-helmet';

const WebDevelopment = () => {
  const { theme } = useTheme();
  
  // Data for the hoverable steps section
  const steps = [
    {
      id: "01",
      title: "Planowanie projektu strony WWW",
      description: "Pierwszym krokiem w tworzeniu strony internetowej jest dokładne zaplanowanie całego projektu, w oparciu o analizę potrzeb i celów biznesowych.",
      features: [
        "Analiza celów biznesowych i potrzeb klienta",
        "Określenie grupy docelowej i buyer personas",
        "Research konkurencji i analiza rynku",
        "Planowanie architektury informacji",
        "Stworzenie planu działania i harmonogramu"
      ]
    },
    {
      id: "02",
      title: "Projektowanie UX/UI",
      description: "Tworzymy prototypy i projekty graficzne strony, dbając o intuicyjny interfejs oraz atrakcyjny wygląd dopasowany do Twojej marki.",
      features: [
        "Tworzenie wireframe'ów i prototypów",
        "Projektowanie ścieżki użytkownika (user flow)",
        "Przygotowanie makiety graficznej strony",
        "Dobór kolorystyki i typografii zgodnej z identyfikacją wizualną",
        "Projektowanie responsywnych widoków dla różnych urządzeń"
      ]
    },
    {
      id: "03",
      title: "Programowanie front-end",
      description: "Przekształcamy projekt graficzny w funkcjonalny kod HTML, CSS i JavaScript, dbając o wysoką jakość i zgodność ze standardami.",
      features: [
        "Kodowanie szablonów HTML5 zgodnych ze standardami W3C",
        "Implementacja stylów CSS z wykorzystaniem nowoczesnych frameworków",
        "Programowanie interakcji i animacji JavaScript",
        "Optymalizacja wydajności ładowania strony",
        "Testy cross-browser dla zapewnienia kompatybilności"
      ]
    },
    {
      id: "04",
      title: "Programowanie back-end",
      description: "Implementujemy funkcjonalności serwera, bazy danych oraz systemu zarządzania treścią, aby Twoja strona działała sprawnie.",
      features: [
        "Konfiguracja serwera i środowiska hostingowego",
        "Implementacja systemu zarządzania treścią (CMS)",
        "Integracja z bazą danych",
        "Tworzenie formularzy i systemu kontaktowego",
        "Implementacja zaawansowanych funkcjonalności (sklep, forum, itp.)"
      ]
    },
    {
      id: "05",
      title: "Testowanie i optymalizacja",
      description: "Przeprowadzamy kompleksowe testy funkcjonalności, użyteczności oraz wydajności, aby zapewnić najwyższą jakość strony.",
      features: [
        "Testy funkcjonalne wszystkich elementów strony",
        "Audyt UX i testy z użytkownikami",
        "Optymalizacja szybkości ładowania",
        "Dostosowanie do wymagań SEO",
        "Testy bezpieczeństwa i ochrony danych"
      ]
    },
    {
      id: "06",
      title: "Wdrożenie i publikacja",
      description: "Uruchamiamy Twoją stronę na serwerze produkcyjnym, przeprowadzamy finalne testy i publikujemy ją w sieci.",
      features: [
        "Konfiguracja środowiska produkcyjnego",
        "Migracja zawartości na serwer docelowy",
        "Konfiguracja domen i certyfikatów SSL",
        "Finalne testy wydajności i bezpieczeństwa",
        "Szkolenie z obsługi systemu CMS"
      ]
    }
  ];

  // Data for the benefits section
  const websiteBenefits = [
    {
      icon: <Globe className="h-[3rem] w-[3rem] text-premium-blue" />,
      title: "Zwiększony zasięg",
      description: "Zwiększa zasięg Twojego biznesu do nowych klientów."
    },
    {
      icon: <Users className="h-[3rem] w-[3rem] text-premium-blue" />,
      title: "Budowanie relacji",
      description: "Buduje trwałe relacje z Twoimi klientami."
    },
    {
      icon: <Search className="h-[3rem] w-[3rem] text-premium-blue" />,
      title: "Analiza użytkowników",
      description: "Daje Ci możliwość analizy zachowań użytkowników."
    },
    {
      icon: <TrendingUp className="h-[3rem] w-[3rem] text-premium-blue" />,
      title: "Pozyskiwanie leadów",
      description: "Pozyskuje dla Ciebie wartościowe leady, aby rozwijać Twój biznes."
    },
    {
      icon: <Sparkles className="h-[3rem] w-[3rem] text-premium-blue" />,
      title: "Przewaga konkurencyjna",
      description: "Zapewnia Ci przewagę konkurencyjną na rynku."
    }
  ];

  // Data for professional website section
  const professionalWebsiteFeatures = [
    {
      icon: <CheckCircle className="h-6 w-6 text-premium-blue" />,
      title: "Pierwsze wrażenie",
      description: "Tworzy pozytywne pierwsze wrażenie jako cyfrowa wizytówka dostępna 24/7."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-premium-blue" />,
      title: "Profesjonalny wizerunek",
      description: "Buduje profesjonalny wizerunek marki, który wyróżnia Cię na tle konkurencji."
    },
    {
      icon: <ScrollText className="h-6 w-6 text-premium-blue" />,
      title: "Jasna komunikacja",
      description: "Przekazuje jasno i strategicznie Twoją ofertę, wartości oraz unikalne korzyści."
    },
    {
      icon: <Target className="h-6 w-6 text-premium-blue" />,
      title: "Prezentacja portfolio",
      description: "Prezentuje portfolio i case studies jako konkretne dowody Twojego doświadczenia."
    },
    {
      icon: <Users className="h-6 w-6 text-premium-blue" />,
      title: "Opinie klientów",
      description: "Zawiera opinie zadowolonych klientów, które budują zaufanie społeczne."
    },
    {
      icon: <Database className="h-6 w-6 text-premium-blue" />,
      title: "Treści eksperckie",
      description: "Dostarcza aktualne treści eksperckie, potwierdzające Twoją wiedzę branżową."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-premium-blue" />,
      title: "Spójność wizualna",
      description: "Zapewnia spójność wizualną zgodną z identyfikacją marki."
    },
    {
      icon: <Phone className="h-6 w-6 text-premium-blue" />,
      title: "Przejrzysty kontakt",
      description: "Oferuje przejrzysty kontakt – pokazuje dostępność i transparentność."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-premium-blue" />,
      title: "Zgodność z prawem",
      description: "Potwierdza legalność działania poprzez politykę prywatności i regulaminy."
    }
  ];

  // Data for Website Type section
  const websiteTypes = [
    {
      icon: "📄",
      title: "Landing Page",
      description: "Strona o uproszczonej strukturze, skupiona na jednej ofercie, idealna dla kampanii marketingowych."
    },
    {
      icon: "📝",
      title: "Blog firmowy",
      description: "Zwiększa organiczną widoczność w wyszukiwarkach, buduje ekspercki wizerunek marki."
    },
    {
      icon: "🏢",
      title: "Strony firmowe",
      description: "Strona firmowa prezentuje ofertę, wyróżniki na tle konkurencji oraz możliwości zakupu."
    },
    {
      icon: "📅",
      title: "One page",
      description: "Zawiera wszystkie informacje na jednej, przewijanej stronie bez dodatkowych podstron."
    },
    {
      icon: "📚",
      title: "Multipage",
      description: "Rozbudowana witryna z wieloma podstronami, idealna dla firm z szeroką ofertą."
    }
  ];

  // Data for the business growth section
  const businessGrowthFeatures = [
    {
      icon: <ShieldCheck className="h-12 w-12 text-premium-blue" />,
      title: "Wiarygodność marki",
      description: "Budowanie zaufania i rozpoznawalności marki."
    },
    {
      icon: <Globe className="h-12 w-12 text-premium-blue" />,
      title: "Zwiększony zasięg",
      description: "Rozszerzanie publiczności i dotarcie do potencjalnych klientów."
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-premium-blue" />,
      title: "Usprawniona ścieżka zakupowa",
      description: "Ułatwienie procesu zakupu dla wygody klienta."
    },
    {
      icon: <Users className="h-12 w-12 text-premium-blue" />,
      title: "Generowanie leadów",
      description: "Przyciąganie wartościowych potencjalnych klientów do wzrostu."
    },
    {
      icon: <Clock className="h-12 w-12 text-premium-blue" />,
      title: "Dostępność 24/7",
      description: "Zapewnienie całodobowej dostępności i wsparcia."
    },
    {
      icon: <Target className="h-12 w-12 text-premium-blue" />,
      title: "Precyzyjne targetowanie",
      description: "Stosowanie działań reklamowych dla określonych odbiorców."
    },
    {
      icon: <ScrollText className="h-12 w-12 text-premium-blue" />,
      title: "Przejrzyste informacje",
      description: "Dostarczanie przejrzystych informacji o produktach i usługach."
    },
    {
      icon: <Database className="h-12 w-12 text-premium-blue" />,
      title: "Zbieranie danych",
      description: "Gromadzenie cennych informacji analitycznych dla usprawnień."
    }
  ];

  // Zaktualizowane dane dla sekcji kroków tworzenia strony - w układzie pionowym
  const websiteCreationSteps = [
    {
      number: "1",
      title: "Analiza branży",
      description: "Przeprowadzamy dogłębną analizę branży i konkurencji, aby zidentyfikować kluczowe elementy.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      number: "2",
      title: "Planowanie treści",
      description: "Tworzymy szczegółowy plan treści z nagłówkami i podtytułami dostosowany do potrzeb SEO.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      number: "3",
      title: "Struktura linków",
      description: "Planujemy nawigację, menu i linkowanie wewnętrzne dla optymalnej struktury strony.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      number: "4",
      title: "Projekt wizualny",
      description: "Opracowujemy unikalny design dopasowany do Twojej marki i celów biznesowych.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      number: "5",
      title: "Tworzenie treści",
      description: "Tworzymy angażujące i zoptymalizowane pod SEO treści, które odpowiadają na potrzeby użytkowników.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      number: "6",
      title: "Optymalizacja SEO",
      description: "Wdrażamy zaawansowane techniki SEO, aby zwiększyć widoczność w wyszukiwarkach.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      number: "7",
      title: "Uruchomienie strony",
      description: "Przenosimy gotową stronę na serwer produkcyjny i przeprowadzamy finalne testy.",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-500"
    }
  ];

  // Data for the FAQ section
  const faqItems = [
    {
      question: "Jak długo trwa proces tworzenia strony internetowej?",
      answer: "Czas realizacji zależy od złożoności projektu. Prosta strona wizytówkowa może być gotowa w 2-3 tygodnie, bardziej rozbudowane projekty mogą zająć od 4 do 12 tygodni. Na czas realizacji wpływa również szybkość dostarczania przez klienta niezbędnych materiałów i zatwierdzeń."
    },
    {
      question: "Czy będę mógł samodzielnie aktualizować treści na stronie?",
      answer: "Tak, wszystkie nasze strony wyposażamy w łatwy w obsłudze system zarządzania treścią (CMS), który pozwala na samodzielną aktualizację tekstów, zdjęć i innych elementów. Dodatkowo przeprowadzamy szkolenie z obsługi systemu, aby klient mógł swobodnie zarządzać swoją stroną."
    },
    {
      question: "Czy projekty są responsywne?",
      answer: "Wszystkie nasze strony internetowe są w pełni responsywne, co oznacza, że doskonale wyświetlają się na wszystkich urządzeniach - od dużych monitorów komputerowych, przez tablety, po smartfony. Responsywność jest obecnie standardem i kluczowym elementem pozycjonowania w Google."
    },
    {
      question: "Czy zajmujecie się hostingiem i utrzymaniem strony?",
      answer: "Tak, oferujemy kompleksowe usługi hostingowe oraz pakiety utrzymania i wsparcia technicznego. Zapewniamy szybkie i bezpieczne serwery, regularne kopie zapasowe, monitoring wydajności oraz szybkie wsparcie w przypadku jakichkolwiek problemów."
    },
    {
      question: "Czy pomagacie w pozycjonowaniu strony?",
      answer: "Tak, każda nasza strona jest zoptymalizowana pod kątem wyszukiwarek (SEO) już na etapie projektowania i kodowania. Dodatkowo oferujemy zaawansowane usługi pozycjonowania i content marketingu, które pomagają osiągnąć wysokie pozycje w wynikach wyszukiwania Google."
    }
  ];

  // Rozszerzone dane dla sekcji branż - dodane nowe branże i więcej szczegółów
  const industryTypes = [
    {
      icon: "🏢",
      name: "Nieruchomości",
      description: "Strony dla deweloperów",
    },
    {
      icon: "🍽️",
      name: "Gastronomia",
      description: "Strony dla restauracji",
    },
    {
      icon: "🏫",
      name: "Szkolnictwo",
      description: "Strony dla szkół i przedszkoli",
    },
    {
      icon: "⚖️",
      name: "Prawo",
      description: "Strony dla prawników i adwokatów",
    },
    {
      icon: "✈️",
      name: "Turystyka",
      description: "Strony dla hoteli i biur podróży",
    },
    {
      icon: "🎨",
      name: "Sztuka",
      description: "Strony dla fotografów i artystów",
    },
    {
      icon: "🏥",
      name: "Medycyna",
      description: "Strony dla lekarzy",
    },
    {
      icon: "💼",
      name: "Firmy",
      description: "Strony B2B",
    },
    {
      icon: "🏛️",
      name: "Architektura",
      description: "Strony dla architektów",
    },
    {
      icon: "🛒",
      name: "E-commerce",
      description: "Sklepy internetowe",
    },
    {
      icon: "🏆",
      name: "Sport",
      description: "Strony dla klubów sportowych",
    },
    {
      icon: "🎓",
      name: "Edukacja",
      description: "Platformy e-learningowe",
    }
  ];

  // Rozszerzone dane dla sekcji lokalizacji - dodane więcej miast w Polsce
  const locations = [
    { name: "Warszawa", icon: "🏙️" },
    { name: "Kraków", icon: "🏰" },
    { name: "Łódź", icon: "🏭" },
    { name: "Wrocław", icon: "🌉" },
    { name: "Poznań", icon: "🏛️" },
    { name: "Gdańsk", icon: "⚓" },
    { name: "Szczecin", icon: "🌊" },
    { name: "Bydgoszcz", icon: "🌆" },
    { name: "Lublin", icon: "🏢" },
    { name: "Białystok", icon: "🌇" },
    { name: "Katowice", icon: "🏙️" },
    { name: "Gdynia", icon: "🌊" },
    { name: "Częstochowa", icon: "⛪" },
    { name: "Radom", icon: "🏘️" },
    { name: "Sosnowiec", icon: "🏗️" },
    { name: "Toruń", icon: "🏰" },
    { name: "Kielce", icon: "🏞️" },
    { name: "Rzeszów", icon: "🏢" }
  ];

  // Nowe dane - zabezpieczenia strony internetowej
  const securityFeatures = [
    {
      icon: <LockIcon className="h-12 w-12 text-premium-blue" />,
      title: "Certyfikat SSL",
      description: "Wszystkie nasze strony posiadają certyfikat SSL, zapewniający szyfrowanie danych i bezpieczne połączenie."
    },
    {
      icon: <ShieldAlert className="h-12 w-12 text-premium-blue" />,
      title: "Ochrona przed atakami",
      description: "Wdrażamy zabezpieczenia przed atakami DDoS, SQL Injection, XSS i innymi cyberzagrożeniami."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-premium-blue" />,
      title: "Regularne aktualizacje",
      description: "Zapewniamy regularne aktualizacje oprogramowania, aby chronić przed nowymi zagrożeniami."
    },
    {
      icon: <Database className="h-12 w-12 text-premium-blue" />,
      title: "Kopie zapasowe",
      description: "Tworzymy automatyczne kopie zapasowe, które pozwalają na szybkie odzyskanie danych w razie awarii."
    }
  ];

  // Nowe dane - dodatkowe technologie
  const additionalTechnologies = [
    {
      name: "WordPress",
      description: "Najpopularniejszy system zarządzania treścią (CMS) na świecie.",
      icon: "🔌"
    },
    {
      name: "WooCommerce",
      description: "Rozszerzenie WordPress dla sklepów internetowych.",
      icon: "🛒"
    },
    {
      name: "PrestaShop",
      description: "Zaawansowana platforma e-commerce.",
      icon: "🏪"
    },
    {
      name: "Magento",
      description: "Rozbudowana platforma dla dużych sklepów internetowych.",
      icon: "📊"
    }
  ];

  // Data for the why technology matters section
  const technologyImportance = [
    {
      icon: <BarChart3 className="h-12 w-12 text-premium-blue" />,
      title: "Wydajność",
      description: "Szybkość ładowania i działania strony internetowej."
    },
    {
      icon: <ShieldCheck className="h-12 w-12 text-premium-blue" />,
      title: "Bezpieczeństwo",
      description: "Ochrona przed atakami i włamaniami."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-premium-blue" />,
      title: "Skalowalność",
      description: "Możliwość rozbudowy wraz z rozwojem firmy."
    }
  ];

  return (
    <div className="min-h-screen bg-premium-dark">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Profesjonalne Tworzenie Stron Internetowych | IDZ.TECH</title>
        <meta name="description" content="Profesjonalne tworzenie stron internetowych dla firm w Warszawie i całej Polsce. Responsywne strony www, sklepy internetowe, landing page. Darmowa wycena!" />
        <meta name="keywords" content="tworzenie stron www, strony internetowe, projektowanie stron internetowych, strona www Warszawa, strony www Kraków, strony internetowe Wrocław, projektowanie stron www, responsywne strony www" />
        <meta property="og:title" content="Profesjonalne Tworzenie Stron Internetowych | IDZ.TECH" />
        <meta property="og:description" content="Tworzymy profesjonalne strony internetowe dla firm. Responsywne, szybkie i przyjazne dla wyszukiwarek. Sprawdź naszą ofertę!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://idz.tech/tworzenie-stron-www" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://idz.tech/tworzenie-stron-www" />
      </Helmet>
      
      <Navbar />
      
      <ServiceBreadcrumb currentPage="Tworzenie stron WWW" currentPath="/tworzenie-stron-www" />
      
      {/* Hero Section */}
      <section className="pt-20 pb-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Profesjonalne <span className="bg-premium-gradient text-transparent bg-clip-text">strony internetowe</span> dla Twojego biznesu
              </h1>
              <p className="text-xl text-premium-light/70">
                Tworzymy nowoczesne, responsywne i szybkie strony internetowe w Warszawie i całej Polsce, które przyciągają klientów i zwiększają konwersję.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-premium-purple" size={20} />
                  <span>Przyjazne dla wyszukiwarek (SEO)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-premium-purple" size={20} />
                  <span>Dopasowane do urządzeń mobilnych</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-premium-purple" size={20} />
                  <span>Intuicyjny panel zarządzania treścią</span>
                </div>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white">
                    Zamów bezpłatną wycenę
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-premium-purple/50 text-black dark:text-premium-light hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                  Zobacz realizacje
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-0.5 bg-premium-gradient rounded-xl blur-sm opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Projektowanie stron internetowych"
                className="w-full h-auto rounded-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* O czym się dowiesz sekcja */}
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8">O czym się dowiesz z tego artykułu</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Tworzenie stron WWW w IDZ.TECH</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Dlaczego nowoczesna strona internetowa to podstawa rozwoju Twojej działalności?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Jakie rodzaje stron WWW oferujemy w IDZ.TECH?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Jak przebiega tworzenie stron WWW w IDZ.TECH?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Ile kosztuje stworzenie strony internetowej i od czego zależy cena?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Co zyskujesz, tworząc stronę internetową z IDZ.TECH?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Czy da się samemu zrobić stronę internetową dla biznesu?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Jak rozpocząć współpracę z IDZ.TECH przy tworzeniu strony WWW?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Jak zabezpieczyć stronę internetową przed cyberatakami?</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={20} className="text-premium-purple" />
                <span>Jakie technologie wykorzystujemy do tworzenia stron www?</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Nasza oferta</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Co możemy dla Ciebie zrobić?
            </h2>
            <p className="text-xl text-premium-light/70">
              Oferujemy kompleksowe usługi związane z tworzeniem stron internetowych, od projektu po wdrożenie i optymalizację.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className={`${theme === 'light' ? 'bg-white shadow-lg' : 'bg-premium-dark/60 border border-white/10'} rounded-xl p-6 transition-transform duration-300`}>
              <h3 className="text-2xl font-semibold mb-4">Projektowanie stron internetowych</h3>
              <p className="text-premium-light/70 mb-4">
                Tworzymy unikalne projekty graficzne, które odzwierciedlają charakter Twojej marki i przyciągają uwagę klientów.
              </p>
              <Link to="/contact">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
            
            {/* Service Card 2 */}
            <div className={`${theme === 'light' ? 'bg-white shadow-lg' : 'bg-premium-dark/60 border border-white/10'} rounded-xl p-6 transition-transform duration-300`}>
              <h3 className="text-2xl font-semibold mb-4">Tworzenie stron responsywnych</h3>
              <p className="text-premium-light/70 mb-4">
                Zapewniamy, że Twoja strona będzie wyglądać i działać doskonale na każdym urządzeniu, od smartfonów po komputery.
              </p>
              <Link to="/contact">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
            
            {/* Service Card 3 */}
            <div className={`${theme === 'light' ? 'bg-white shadow-lg' : 'bg-premium-dark/60 border border-white/10'} rounded-xl p-6 transition-transform duration-300`}>
              <h3 className="text-2xl font-semibold mb-4">Optymalizacja SEO</h3>
              <p className="text-premium-light/70 mb-4">
                Dbamy o to, aby Twoja strona była widoczna w wynikach wyszukiwania Google, co przekłada się na większy ruch i więcej klientów.
              </p>
              <Link to="/contact">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technology Stack Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[1
