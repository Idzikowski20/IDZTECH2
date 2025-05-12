
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Phone, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';
import { useTheme } from '@/utils/themeContext';
import HoverableSteps from '@/components/HoverableSteps';

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

  // Data for the pricing plans
  const pricingPlans = [
    {
      name: "Basic",
      price: "od 1 999 zł",
      description: "Idealne rozwiązanie dla małych firm i przedsiębiorców rozpoczynających działalność online.",
      features: [
        "Responsywna strona www",
        "Do 5 podstron",
        "Podstawowe SEO",
        "Formularz kontaktowy",
        "Integracja z mediami społecznościowymi"
      ],
      recommended: false,
      ctaText: "Wybieram pakiet Basic"
    },
    {
      name: "Premium",
      price: "od 4 499 zł",
      description: "Kompleksowe rozwiązanie dla firm, które chcą wyróżnić się w internecie.",
      features: [
        "Wszystko z pakietu Basic",
        "Do 15 podstron",
        "Zaawansowane SEO",
        "Blog z systemem komentarzy",
        "Panel administracyjny CMS",
        "Szkolenie z obsługi systemu",
        "Google Analytics"
      ],
      recommended: true,
      ctaText: "Wybieram pakiet Premium"
    },
    {
      name: "Enterprise",
      price: "od 8 999 zł",
      description: "Dedykowane rozwiązania dla dużych firm i korporacji z zaawansowanymi potrzebami.",
      features: [
        "Wszystko z pakietu Premium",
        "Nieograniczona liczba podstron",
        "Dedykowany projekt UX/UI",
        "Zaawansowane funkcjonalności",
        "Integracje z systemami zewnętrznymi",
        "Migracja danych",
        "6 miesięcy wsparcia technicznego"
      ],
      recommended: false,
      ctaText: "Wybieram pakiet Enterprise"
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

  return (
    <div className="min-h-screen bg-premium-dark">
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
                Tworzymy nowoczesne, responsywne i szybkie strony internetowe, które przyciągają klientów i zwiększają konwersję.
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
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Projektowanie stron internetowych</h3>
              <p className="text-premium-light/70 mb-4">
                Tworzymy unikalne projekty graficzne, które odzwierciedlają charakter Twojej marki i przyciągają uwagę klientów.
              </p>
              <Link to="/kontakt">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
            
            {/* Service Card 2 */}
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Tworzenie stron responsywnych</h3>
              <p className="text-premium-light/70 mb-4">
                Zapewniamy, że Twoja strona będzie wyglądać i działać doskonale na każdym urządzeniu, od smartfonów po komputery.
              </p>
              <Link to="/kontakt">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
            
            {/* Service Card 3 */}
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Optymalizacja SEO</h3>
              <p className="text-premium-light/70 mb-4">
                Dbamy o to, aby Twoja strona była widoczna w wynikach wyszukiwania Google, co przekłada się na większy ruch i więcej klientów.
              </p>
              <Link to="/kontakt">
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
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Technologie</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              W czym tworzymy strony internetowe?
            </h2>
            <p className="text-xl text-premium-light/70">
              Korzystamy z najnowszych technologii, aby zapewnić Ci szybką, bezpieczną i funkcjonalną stronę internetową.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
            {/* Technology Logos - Updated to use colorful logos */}
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
                alt="JavaScript"
                className="h-12 w-auto transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">JavaScript</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
                alt="CSS3"
                className="h-12 w-auto transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">CSS3</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png"
                alt="HTML5"
                className="h-12 w-auto transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">HTML5</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
                alt="TypeScript"
                className="h-12 w-auto transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">TypeScript</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                alt="React"
                className="h-12 w-auto transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">React</p>
            </div>
            <div>
              <img
                src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg"
                alt="Tailwind CSS"
                className="h-12 w-auto transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">Tailwind CSS</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Steps Section */}
      <section className="py-20 relative overflow-hidden bg-premium-dark/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Nasz proces</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Dowiedz się więcej o tworzeniu stron www
            </h2>
            <p className="text-xl text-premium-light/70">
              Poznaj szczegółowo etapy realizacji projektu strony internetowej - od planowania do wdrożenia.
            </p>
          </div>
          
          <HoverableSteps steps={steps} className="mt-10" />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Cennik</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Pakiety tworzenia stron www
            </h2>
            <p className="text-xl text-premium-light/70">
              Wybierz pakiet dopasowany do potrzeb Twojego biznesu. Każdy projekt wyceniamy indywidualnie.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`${theme === 'light' ? 'bg-white shadow-xl' : 'bg-premium-dark/60 border border-white/10'} rounded-xl p-8 relative ${plan.recommended ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 -right-4">
                    <span className="bg-premium-gradient text-xs font-medium px-3 py-1 rounded-full text-white">Polecany</span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{plan.name}</h3>
                <div className="flex items-baseline mb-5">
                  <span className={`text-3xl font-bold ${theme === 'light' ? 'text-black' : 'text-white'}`}>{plan.price}</span>
                </div>
                <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{plan.description}</p>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="text-premium-purple" size={18} />
                      </div>
                      <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/contact" className="block">
                  <Button 
                    className={`w-full ${plan.recommended 
                      ? 'bg-premium-gradient hover:opacity-90 transition-opacity text-white' 
                      : `${theme === 'light' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}`}
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden bg-premium-dark/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">FAQ</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Najczęściej zadawane pytania
            </h2>
            <p className="text-xl text-premium-light/70">
              Odpowiadamy na najczęstsze pytania dotyczące procesu tworzenia stron internetowych.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 ${theme === 'light' ? 'bg-white shadow-md' : 'bg-premium-dark/60 border border-white/10'}`}
              >
                <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{item.question}</h3>
                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-premium-gradient opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/30 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-premium-purple font-medium">Zacznijmy!</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-6">
              Stwórzmy razem Twoją nową stronę internetową
            </h2>
            <p className="text-premium-light/70 text-lg mb-8 max-w-2xl mx-auto">
              Skontaktuj się z nami już dziś, aby omówić szczegóły Twojego projektu i otrzymać bezpłatną wycenę.
            </p>
            <Link to="/contact">
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                Darmowa konsultacja
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebDevelopment;
