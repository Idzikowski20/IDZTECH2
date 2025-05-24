import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import { FaSearch, FaBug, FaFileAlt, FaChartLine, FaRegLightbulb, FaCogs, FaUsers, FaMobileAlt } from 'react-icons/fa';
import SplineSEO from '@/components/SplineSEO';
import { useTheme } from '@/utils/themeContext';
import { Link } from "react-router-dom";

const SeoAudit = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-premium-blue font-medium">Audyt SEO</span>
              <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 bg-premium-gradient bg-clip-text text-transparent">
                Audyt SEO
              </h1>
              <p className="text-premium-light/80 text-lg mb-8">
                Profesjonalny audyt SEO to podstawa skutecznej optymalizacji. Sprawdź, co blokuje widoczność Twojej strony w Google.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/contact">
                <Button 
                  className="bg-premium-gradient hover:opacity-90 transition-all group relative overflow-hidden"
                  size="lg"
                >
                  <span className="relative z-10 text-white">Zamów audyt SEO</span>
                  <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <SplineSEO />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Kafelki jak w LocalSeo */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Co obejmuje audyt SEO?</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Zakres audytu SEO</h2>
          <p className="text-premium-light/70 text-lg">
            Audyt SEO to kompleksowa analiza Twojej strony pod kątem technicznym, treściowym i konkurencyjnym. Oto, co sprawdzamy:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaSearch size={40} color="#A259FF" />, title: 'Analiza techniczna', desc: 'Pełna analiza kodu, prędkości ładowania, responsywności i błędów technicznych.' },
            { icon: <FaFileAlt size={40} color="#00C2FF" />, title: 'Analiza treści', desc: 'Sprawdzamy treści, słowa kluczowe, strukturę nagłówków i meta tagi.' },
            { icon: <FaChartLine size={40} color="#FF6B81" />, title: 'Analiza konkurencji', desc: 'Porównujemy Twoją stronę z konkurencją i wskazujemy przewagi oraz braki.' },
            { icon: <FaRegLightbulb size={40} color="#FFB800" />, title: 'Rekomendacje', desc: 'Otrzymujesz szczegółowy raport z rekomendacjami i planem działań.' },
            { icon: <FaCogs size={40} color="#00C2FF" />, title: 'Optymalizacja techniczna', desc: 'Wskazujemy jak poprawić wydajność, bezpieczeństwo i strukturę strony.' },
            { icon: <FaUsers size={40} color="#A259FF" />, title: 'UX i dostępność', desc: 'Analizujemy użyteczność strony i dostępność dla wszystkich użytkowników.' },
            { icon: <FaMobileAlt size={40} color="#FF6B81" />, title: 'Mobile SEO', desc: 'Sprawdzamy optymalizację strony pod urządzenia mobilne.' },
            { icon: <FaBug size={40} color="#A259FF" />, title: 'Wykrywanie błędów', desc: 'Identyfikujemy błędy blokujące pozycjonowanie i widoczność strony.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`backdrop-blur-sm border rounded-xl p-6 flex flex-col items-center text-center group ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}
            >
              <div className="h-20 w-20 bg-premium-gradient/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-premium-gradient/20 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="font-medium mb-2">{item.title}</h3>
              <p className="text-premium-light/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Jak wygląda proces audytu SEO?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Analiza techniczna",
              description: "Badamy kod strony, prędkość ładowania, responsywność oraz inne czynniki wpływające na pozycjonowanie."
            },
            {
              title: "2. Analiza treści",
              description: "Sprawdzamy treści pod kątem SEO, analizujemy słowa kluczowe i strukture strony."
            },
            {
              title: "3. Raport i rekomendacje",
              description: "Przedstawiamy kompletny raport z rekomendacjami działań niezbędnych do poprawy widoczności."
            }
          ].map((step, index) => (
            <Card key={index} className="border border-premium-dark/10 transition-all hover:border-premium-purple rounded-xl animate-fade-in bg-transparent" style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}>
              <CardContent className="p-8 bg-transparent">
                <h3 className="text-xl font-bold mb-4 text-premium-purple">{step.title}</h3>
                <p className="text-premium-light/80">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Najczęściej zadawane pytania</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              question: "Ile kosztuje audyt SEO?",
              answer: "Cena audytu SEO zależy od wielkości strony i zakresu analizy. Skontaktuj się z nami, aby otrzymać indywidualną wycenę."
            },
            {
              question: "Jak długo trwa wykonanie audytu SEO?",
              answer: "Standardowy audyt SEO wykonujemy w ciągu 7-14 dni roboczych, w zależności od wielkości strony."
            },
            {
              question: "Czy po audycie SEO otrzymam konkretne wskazówki?",
              answer: "Tak, każdy audyt zawiera szczegółowe rekomendacje działań, które należy podjąć, aby poprawić widoczność strony."
            },
            {
              question: "Czy mogę zamówić sam audyt bez dalszej współpracy?",
              answer: "Oczywiście, audyt SEO to usługa, którą możesz zamówić jednorazowo, bez zobowiązań do dalszej współpracy."
            }
          ].map((faq, index) => (
            <HoverCard key={index} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="p-6 border border-premium-light rounded-xl cursor-pointer hover:border-premium-purple transition-all animate-fade-in" style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}>
                  <h3 className="text-xl font-medium">{faq.question}</h3>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 border border-premium-light p-4">
                <p className="text-sm">{faq.answer}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </section>

      <section className="py-16 relative overflow-hidden mx-[30px] rounded-[20px]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">Gotowy na zwiększenie widoczności swojej strony?</h2>
            <p className="text-premium-light/70 text-lg mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
            Zrób pierwszy krok do skutecznego pozycjonowania. Zamów profesjonalny audyt SEO!
            </p>
            <Link to="/contact">
            <Button 
              size="lg" 
              className="bg-premium-gradient hover:opacity-90 transition-opacity animate-fade-in group relative overflow-hidden"
              style={{animationDelay: "0.4s"}}
            >
              <span className="relative z-10 text-white">Zamów bezpłatną wycenę</span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SeoAudit;
