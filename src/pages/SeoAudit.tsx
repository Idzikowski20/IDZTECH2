
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const SeoAudit = () => {
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-premium-gradient bg-clip-text text-transparent">
            Audyt SEO
          </h1>
          <p className="text-xl text-premium-light/80 leading-relaxed">
            Profesjonalny audyt SEO to podstawa skutecznej optymalizacji. Sprawdź, co blokuje widoczność Twojej strony w Google.
          </p>
          <div className="pt-6">
            <Button 
              className="bg-premium-gradient hover:opacity-90 transition-all transform hover:scale-105"
              size="lg"
            >
              Zamów audyt SEO
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-3xl font-bold">Dlaczego warto zrobić audyt SEO?</h2>
            <p className="text-premium-light/80">
              Audyt SEO to kompleksowe badanie Twojej strony pod kątem czynników wpływających na jej widoczność w wyszukiwarce Google. Profesjonalny audyt SEO wskaże wszystkie problemy techniczne i optymalizacyjne, które blokują wysokie pozycje Twojej strony.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Pełna analiza techniczna strony i wskazanie błędów</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Analiza treści i słów kluczowych</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Analiza konkurencji i benchmarking</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Szczegółowe rekomendacje i plan działań</p>
              </li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <img 
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
              alt="Audyt SEO" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto bg-premium-dark/50 rounded-3xl">
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
            <Card key={index} className="border border-premium-light/10 bg-premium-dark/70 hover:bg-premium-dark/90 transition-all hover:border-premium-purple rounded-xl animate-fade-in" style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-premium-purple">{step.title}</h3>
                <p className="text-premium-light/80">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto mt-12 mb-12 bg-premium-gradient rounded-3xl">
        <div className="max-w-3xl mx-auto text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold text-white">Gotowy na zwiększenie widoczności swojej strony?</h2>
          <p className="text-white/90 text-lg">
            Zrób pierwszy krok do skutecznego pozycjonowania. Zamów profesjonalny audyt SEO!
          </p>
          <Button className="bg-white text-premium-purple hover:bg-white/90 transition-all transform hover:scale-105">
            Zamów bezpłatną wycenę
          </Button>
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
                <div className="p-6 border border-premium-light/10 rounded-xl cursor-pointer hover:border-premium-purple transition-all animate-fade-in" style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}>
                  <h3 className="text-xl font-medium">{faq.question}</h3>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-premium-dark/95 border border-premium-light/10 p-4">
                <p className="text-sm text-premium-light/80">{faq.answer}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SeoAudit;
