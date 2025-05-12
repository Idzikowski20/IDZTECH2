
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';
import CMSFeatureSection from '@/components/CMSFeatureSection';
import { useTheme } from '@/utils/themeContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Server, Globe, Zap, LayoutTemplate, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WebDevelopment = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: <Code className="h-6 w-6 text-white" />,
      title: "Nowoczesny front-end",
      description: "Tworzymy nowoczesne i responsywne strony internetowe w oparciu o najnowsze technologie i frameworki."
    },
    {
      icon: <Server className="h-6 w-6 text-white" />,
      title: "Optymalizacja back-end",
      description: "Implementujemy wydajny i bezpieczny back-end, dbając o szybkość działania i stabilność aplikacji."
    },
    {
      icon: <Globe className="h-6 w-6 text-white" />,
      title: "Optymalizacja SEO",
      description: "Każda tworzona przez nas strona jest zoptymalizowana pod kątem wyszukiwarek internetowych."
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Wydajność i szybkość",
      description: "Dbamy o czas ładowania strony, co przekłada się na lepsze doświadczenia użytkowników i wyższą konwersję."
    },
    {
      icon: <LayoutTemplate className="h-6 w-6 text-white" />,
      title: "Autorski system CMS",
      description: "Oferujemy własny system zarządzania treścią, który jest intuicyjny i łatwy w obsłudze."
    }
  ];
  
  const techStack = [
    "React", "Next.js", "TypeScript", "Node.js", "Express", "Supabase",
    "Tailwind CSS", "PostgreSQL", "GraphQL", "REST API", "Redux", "Zustand"
  ];
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      
      <div className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <ServiceBreadcrumb 
            items={[
              { name: "Strona główna", href: "/" },
              { name: "Usługi", href: "/uslugi/seo" },
              { name: "Tworzenie stron WWW", href: "/uslugi/tworzenie-stron" }
            ]} 
          />
        </div>
      </div>
      
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Profesjonalne <span className="bg-premium-gradient text-transparent bg-clip-text">tworzenie stron internetowych</span> dla Twojego biznesu
              </h1>
              
              <p className={`text-xl mb-8 ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/80'}`}>
                Tworzymy nowoczesne, responsywne i zoptymalizowane strony internetowe, 
                które przyciągają uwagę, zwiększają konwersję i budują wizerunek Twojej marki.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/kontakt">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white px-8 py-3 rounded-full">
                    Darmowa konsultacja
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/projekty">
                  <Button 
                    variant="outline" 
                    className={`px-8 py-3 rounded-full ${
                      theme === 'light' 
                        ? 'border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-white' 
                        : 'border-premium-light/20 text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    Zobacz nasze projekty
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {techStack.slice(0, 8).map((tech, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1 rounded-full text-sm border ${
                      theme === 'light' 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-premium-light/10 bg-premium-dark/40'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
                <div className={`relative p-1 rounded-xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                    alt="Tworzenie stron internetowych" 
                    className="w-full h-auto rounded-lg object-cover aspect-video" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className={`py-16 ${theme === 'light' ? 'bg-gray-50' : 'bg-premium-dark/40'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className={`text-premium-purple font-medium ${theme === 'light' ? '' : 'text-opacity-90'}`}>
              Nasze podejście
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Dlaczego nasze strony internetowe się wyróżniają?
            </h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/70'}`}>
              Łączymy kreatywne podejście z techniczną precyzją, tworząc strony, które nie tylko świetnie 
              wyglądają, ale również doskonale działają.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg border transition-transform hover:scale-105 ${
                  theme === 'light' 
                    ? 'bg-white border-gray-200' 
                    : 'bg-premium-dark/50 border-premium-light/10'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Include CMS Feature Section */}
      <CMSFeatureSection />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
                <div className={`relative p-1 rounded-xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1336&q=80" 
                    alt="Proces tworzenia stron" 
                    className="w-full h-auto rounded-lg object-cover aspect-video" 
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <span className={`text-premium-purple font-medium ${theme === 'light' ? '' : 'text-opacity-90'}`}>
                Proces realizacji
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
                Jak przebiega proces tworzenia strony?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-premium-gradient">
                      <span className="text-white font-medium">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Analiza i projektowanie</h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
                      Rozpoczynamy od analizy potrzeb i celów Twojego biznesu. Na tej podstawie projektujemy 
                      strukturę i wygląd strony, uwzględniając najlepsze praktyki UX/UI.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-premium-gradient">
                      <span className="text-white font-medium">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Programowanie i wdrażanie</h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
                      Następnie nasz zespół programistów implementuje projekt, tworząc responsywną i funkcjonalną 
                      stronę internetową z wykorzystaniem nowoczesnych technologii.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-premium-gradient">
                      <span className="text-white font-medium">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Testowanie i optymalizacja</h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
                      Dokładnie testujemy stronę pod kątem użyteczności, wydajności i kompatybilności z różnymi 
                      urządzeniami i przeglądarkami, a także optymalizujemy ją pod kątem SEO.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-premium-gradient">
                      <span className="text-white font-medium">4</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Uruchomienie i wsparcie</h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
                      Po zatwierdzeniu, uruchamiamy stronę i zapewniamy kompleksowe wsparcie techniczne, 
                      a także szkolenie z obsługi systemu CMS.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/kontakt">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white px-8 py-3 rounded-full">
                    Rozpocznij projekt
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className={`py-16 ${theme === 'light' ? 'bg-gray-50' : 'bg-premium-dark/40'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className={`text-premium-purple font-medium ${theme === 'light' ? '' : 'text-opacity-90'}`}>
              Dla kogo?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Tworzymy strony dla różnorodnych branż
            </h2>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/70'}`}>
              Nasze doświadczenie obejmuje tworzenie stron internetowych dla firm z wielu różnych branż. 
              Oto niektóre z nich:
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "E-commerce i sklepy internetowe",
              "Biznesy lokalne i usługi",
              "Kancelarie prawne i biura księgowe",
              "Branża medyczna i kliniki",
              "Branża nieruchomości",
              "Edukacja i szkolenia",
              "Firmy budowlane i remontowe",
              "Restauracje i gastronomia",
              "Hotele i turystyka"
            ].map((industry, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  theme === 'light' 
                    ? 'bg-white border-gray-200 hover:border-premium-purple/30' 
                    : 'bg-premium-dark/50 border-premium-light/10 hover:border-premium-purple/30'
                } transition-all duration-300 flex items-center`}
              >
                <CheckCircle className="h-5 w-5 text-premium-purple mr-3 flex-shrink-0" />
                <span className={theme === 'light' ? 'text-gray-800' : 'text-premium-light'}>
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className={`rounded-2xl p-8 md:p-12 ${
            theme === 'light' 
              ? 'bg-gray-100' 
              : 'bg-premium-dark/50 border border-premium-light/10'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Gotowy na profesjonalną stronę internetową?
                </h2>
                <p className={`text-lg max-w-2xl ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/80'}`}>
                  Skontaktuj się z nami już dziś, aby omówić Twój projekt i rozpocząć proces tworzenia 
                  skutecznej strony internetowej dla Twojego biznesu.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/kontakt">
                  <Button 
                    className="bg-premium-gradient hover:opacity-90 transition-opacity text-white px-8 py-6 rounded-full whitespace-nowrap"
                    size="lg"
                  >
                    Darmowa konsultacja
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebDevelopment;
