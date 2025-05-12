
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const WebDevelopment = () => {
  // Ensure scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 relative">
        {/* Light effects */}
        <div className="absolute top-40 left-20 w-24 h-24 bg-premium-purple/60 rounded-full blur-[50px] animate-pulse-slow"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-premium-blue/60 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
        <div className="absolute bottom-40 left-1/2 w-28 h-28 bg-premium-pink/60 rounded-full blur-[55px] animate-pulse-slow delay-300"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-premium-blue via-premium-purple to-premium-pink">
              Tworzenie stron WWW
            </h1>
            <p className="text-xl text-premium-light/70 mb-8">
              Projektujemy i budujemy nowoczesne strony internetowe, które przyciągają uwagę i generują konwersje.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-premium-gradient hover:opacity-90 transition-opacity">
                  Zamów stronę internetową
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda section - Added based on reference image */}
      <section className="py-16 bg-premium-dark/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">O czym się dowiesz z tego artykułu</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Tworzenie stron WWW w IDZ.TECH</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Dlaczego nowoczesna strona internetowa to podstawa rozwoju Twojej działalności?</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Jakie rodzaje stron WWW oferujemy w IDZ.TECH?</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Jak przebiega tworzenie stron WWW w IDZ.TECH?</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Ile kosztuje stworzenie strony internetowej i od czego zależy cena?</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Co zyskujesz, tworząc stronę internetową z IDZ.TECH?</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Czy da się samemu zrobić stronę internetową dla biznesu?</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-premium-purple min-w-[20px]">➤</div>
                <p className="text-lg">Jak rozpocząć współpracę z IDZ.TECH przy tworzeniu strony WWW?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Projektujemy strony internetowe, które sprzedają</h2>
            <p className="text-premium-light/70">
              Nasze strony internetowe to nie tylko piękny design - to narzędzia biznesowe, które pomagają przyciągać klientów, budować markę i zwiększać sprzedaż.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Responsywny Design</h3>
              <p className="text-premium-light/70">
                Nasze strony dostosowują się do każdego urządzenia - telefonu, tabletu i komputera, zapewniając optymalne doświadczenie użytkownika.
              </p>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Szybkie Ładowanie</h3>
              <p className="text-premium-light/70">
                Optymalizujemy każdą stronę pod kątem szybkości, co przekłada się na lepsze wrażenia użytkownika i wyższe pozycje w wyszukiwarkach.
              </p>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Optymalizacja SEO</h3>
              <p className="text-premium-light/70">
                Każda nasza strona jest zbudowana z myślą o wyszukiwarkach, co pomaga zwiększyć organiczny ruch i widoczność online.
              </p>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Przyjazny Interfejs</h3>
              <p className="text-premium-light/70">
                Tworzymy intuicyjne strony, które są łatwe w nawigacji i pozwalają użytkownikom szybko znaleźć to, czego szukają.
              </p>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Panel CMS</h3>
              <p className="text-premium-light/70">
                Dostarczamy łatwy w obsłudze system do zarządzania treścią, dzięki któremu możesz samodzielnie aktualizować swoją stronę bez wiedzy technicznej.
              </p>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analityka</h3>
              <p className="text-premium-light/70">
                Integrujemy narzędzia analityczne, które dostarczają cennych informacji o użytkownikach i ich zachowaniu na Twojej stronie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies section - Updated to remove Tailwind CSS */}
      <section className="py-20 bg-premium-dark/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technologie</h2>
            <p className="text-premium-light/70 max-w-2xl mx-auto">
              Korzystamy z najnowszych technologii, aby zapewnić Ci szybką, bezpieczną i funkcjonalną stronę internetową.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 items-center">
            <div className="text-center">
              <img src="/lovable-uploads/JavaScript.svg" alt="JavaScript" className="h-16 mx-auto mb-3" />
              <p>JavaScript</p>
            </div>
            <div className="text-center">
              <img src="/lovable-uploads/CSS3.svg" alt="CSS3" className="h-16 mx-auto mb-3" />
              <p>CSS3</p>
            </div>
            <div className="text-center">
              <img src="/lovable-uploads/HTML5.svg" alt="HTML5" className="h-16 mx-auto mb-3" />
              <p>HTML5</p>
            </div>
            <div className="text-center">
              <img src="/lovable-uploads/TypeScript.svg" alt="TypeScript" className="h-16 mx-auto mb-3" />
              <p>TypeScript</p>
            </div>
            <div className="text-center">
              <img src="/lovable-uploads/React.svg" alt="React" className="h-16 mx-auto mb-3" />
              <p>React</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process section - Updated with vertical alternating left-right layout */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Proces tworzenia</h2>
            <h3 className="text-xl font-semibold mb-4">Kroki do stworzenia strony internetowej</h3>
            <p className="text-premium-light/70 max-w-2xl mx-auto">
              Poznaj etapy tworzenia skutecznej strony internetowej, która będzie wspierać Twój biznes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold">Analiza branży</h3>
                </div>
                <p className="text-premium-light/70">
                  Przeprowadzamy dogłębną analizę branży i konkurencji, aby zidentyfikować kluczowe elementy.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/analysis.svg" alt="Analiza branży" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold">Planowanie treści</h3>
                </div>
                <p className="text-premium-light/70">
                  Tworzymy szczegółowy plan treści z nagłówkami i podtytułami dostosowany do potrzeb SEO.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/planning.svg" alt="Planowanie treści" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold">Struktura linków</h3>
                </div>
                <p className="text-premium-light/70">
                  Planujemy nawigację, menu i linkowanie wewnętrzne dla optymalnej struktury strony.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/structure.svg" alt="Struktura linków" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-bold">Projekt wizualny</h3>
                </div>
                <p className="text-premium-light/70">
                  Opracowujemy unikalny design dopasowany do Twojej marki i celów biznesowych.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/design.svg" alt="Projekt wizualny" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <h3 className="text-xl font-bold">Tworzenie treści</h3>
                </div>
                <p className="text-premium-light/70">
                  Tworzymy angażujące i zoptymalizowane pod SEO treści, które odpowiadają na potrzeby użytkowników.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/content.svg" alt="Tworzenie treści" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">6</span>
                  </div>
                  <h3 className="text-xl font-bold">Optymalizacja SEO</h3>
                </div>
                <p className="text-premium-light/70">
                  Wdrażamy zaawansowane techniki SEO, aby zwiększyć widoczność w wyszukiwarkach.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/seo.svg" alt="Optymalizacja SEO" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                    <span className="text-white font-bold">7</span>
                  </div>
                  <h3 className="text-xl font-bold">Uruchomienie strony</h3>
                </div>
                <p className="text-premium-light/70">
                  Przenosimy gotową stronę na serwer produkcyjny i przeprowadzamy finalne testy.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
                  <img src="/lovable-uploads/launch.svg" alt="Uruchomienie strony" className="w-full h-auto p-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-20 bg-premium-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ile kosztuje strona internetowa?</h2>
            <p className="text-premium-light/70">
              Cena strony internetowej zależy od wielu czynników, takich jak złożoność projektu, liczba podstron, funkcjonalności czy indywidualne wymagania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="mb-4">
                <span className="text-premium-purple text-sm font-semibold uppercase tracking-wider">Basic</span>
                <h3 className="text-3xl font-bold mt-2">Strona wizytówka</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">od 1 999 zł</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Do 5 podstron</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Responsywny design</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Podstawowa optymalizacja SEO</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Formularz kontaktowy</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Integracja z Google Analytics</span>
                </li>
              </ul>
              
              <Link to="/contact">
                <Button className="w-full bg-premium-gradient hover:opacity-90 transition-opacity">
                  Zamów stronę
                </Button>
              </Link>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300 transform md:-translate-y-4 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-premium-gradient text-white px-4 py-1 rounded-full text-sm font-bold">
                Polecany
              </div>
              
              <div className="mb-4">
                <span className="text-premium-purple text-sm font-semibold uppercase tracking-wider">Standard</span>
                <h3 className="text-3xl font-bold mt-2">Strona firmowa</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">od 3 499 zł</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Do 10 podstron</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Zaawansowany design</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Blog / Aktualności</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Zaawansowane SEO</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Panel CMS</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Szkolenie z obsługi</span>
                </li>
              </ul>
              
              <Link to="/contact">
                <Button className="w-full bg-premium-gradient hover:opacity-90 transition-opacity">
                  Zamów stronę
                </Button>
              </Link>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 hover:border-premium-light/30 transition-all duration-300">
              <div className="mb-4">
                <span className="text-premium-purple text-sm font-semibold uppercase tracking-wider">Premium</span>
                <h3 className="text-3xl font-bold mt-2">Sklep internetowy</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">od 5 999 zł</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Nieograniczona liczba produktów</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>System płatności online</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Integracje z kurierami</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>System rabatów i promocji</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Zaawansowany panel administracyjny</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-premium-purple flex-shrink-0 mt-1 mr-3" size={18} />
                  <span>Indywidualne funkcje</span>
                </li>
              </ul>
              
              <Link to="/contact">
                <Button className="w-full bg-premium-gradient hover:opacity-90 transition-opacity">
                  Zamów sklep
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Co zyskujesz?</h2>
            <p className="text-premium-light/70">
              Tworząc stronę internetową z nami, otrzymujesz znacznie więcej niż tylko kod HTML i design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Strategiczne podejście</h3>
                <p className="text-premium-light/70">
                  Nie tworzymy stron internetowych w oderwaniu od strategii biznesowej. Każdy element witryny jest przemyślany tak, aby wspierać Twoje cele biznesowe.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Unikalne projekty</h3>
                <p className="text-premium-light/70">
                  Każda nasza strona jest tworzona od podstaw, zgodnie z Twoimi potrzebami i specyfiką branży. Nie korzystamy z gotowych szablonów.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Wsparcie techniczne</h3>
                <p className="text-premium-light/70">
                  Po uruchomieniu strony nie zostawiamy Cię samego. Oferujemy wsparcie techniczne i pomoc w rozwoju witryny.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Szkolenie z obsługi</h3>
                <p className="text-premium-light/70">
                  Pokazujemy, jak samodzielnie aktualizować treści na stronie, dzięki czemu zyskujesz niezależność i oszczędzasz na późniejszych modyfikacjach.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Kompleksowość</h3>
                <p className="text-premium-light/70">
                  Oferujemy pełen zakres usług związanych z obecnością online - od domeny i hostingu, przez tworzenie strony, po marketing internetowy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Gwarancja jakości</h3>
                <p className="text-premium-light/70">
                  Wszystkie nasze strony objęte są gwarancją, która zapewnia wsparcie techniczne i pomoc w przypadku ewentualnych problemów.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 bg-premium-dark/50 relative overflow-hidden">
        {/* Light effects */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-premium-purple/30 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-premium-blue/30 rounded-full blur-[80px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Gotowy, aby stworzyć swoją stronę internetową?</h2>
            <p className="text-xl text-premium-light/70 mb-8">
              Skontaktuj się z nami i omów swój projekt. Pierwsza konsultacja jest zawsze bezpłatna.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-premium-gradient hover:opacity-90 transition-opacity">
                  Skontaktuj się z nami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebDevelopment;
