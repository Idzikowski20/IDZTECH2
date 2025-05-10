
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";

const SeoOptimization = () => {
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-premium-gradient bg-clip-text text-transparent">
            Optymalizacja SEO
          </h1>
          <p className="text-xl text-premium-light/80 leading-relaxed">
            Profesjonalna optymalizacja strony to klucz do wysokich pozycji. Wykorzystaj naszą wiedzę, aby poprawić widoczność w Google.
          </p>
          <div className="pt-6">
            <Button 
              className="bg-premium-gradient hover:opacity-90 transition-all transform hover:scale-105"
              size="lg"
            >
              Zamów optymalizację SEO
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-3xl font-bold">Dlaczego optymalizacja SEO jest ważna?</h2>
            <p className="text-premium-light/80">
              Optymalizacja SEO to kompleksowe działania mające na celu dostosowanie Twojej strony do wymagań wyszukiwarki Google. Dobrze zoptymalizowana witryna ma szansę na wysokie pozycje w wynikach wyszukiwania, co przekłada się na większy ruch i konwersje.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Eliminacja błędów technicznych blokujących indeksację</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Usprawnienie struktury strony i treści</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Optymalizacja pod kątem wydajności i UX</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Poprawa widoczności w wyszukiwarkach</p>
              </li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <img 
              src="https://img.freepik.com/free-vector/seo-analysis-concept-illustration_114360-7238.jpg" 
              alt="Optymalizacja SEO - ilustracja" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto bg-premium-dark/50 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Co obejmuje optymalizacja SEO?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Optymalizacja techniczna",
              description: "Eliminacja błędów technicznych, poprawa indeksacji i struktury strony."
            },
            {
              title: "Optymalizacja treści",
              description: "Dostosowanie treści do wymogów SEO i intencji użytkowników."
            },
            {
              title: "Optymalizacja UX",
              description: "Poprawa doświadczeń użytkownika i wskaźników behawioralnych."
            },
            {
              title: "Optymalizacja mobilna",
              description: "Dostosowanie strony do urządzeń mobilnych zgodnie z Mobile-First Index."
            }
          ].map((service, index) => (
            <Card key={index} className="border border-premium-light/10 bg-premium-dark/70 hover:bg-premium-dark/90 transition-all hover:border-premium-purple rounded-xl animate-fade-in" style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-premium-purple">{service.title}</h3>
                <p className="text-premium-light/80">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-12">Jak wygląda proces optymalizacji SEO?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Audyt początkowy",
                description: "Kompleksowy audyt SEO strony, identyfikacja problemów i blokad."
              },
              {
                step: "2",
                title: "Plan optymalizacji",
                description: "Przygotowanie szczegółowego planu działań optymalizacyjnych."
              },
              {
                step: "3",
                title: "Implementacja zmian",
                description: "Wdrożenie rekomendacji i wykonanie niezbędnych poprawek."
              },
              {
                step: "4",
                title: "Monitorowanie efektów",
                description: "Analiza rezultatów i dostosowywanie strategii w razie potrzeby."
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}>
                <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center shrink-0">
                  <span className="font-bold text-premium-light">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-premium-light/80">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto mt-12 mb-12 bg-premium-gradient rounded-3xl">
        <div className="max-w-3xl mx-auto text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold text-white">Gotowy na lepszą widoczność w Google?</h2>
          <p className="text-white/90 text-lg">
            Zamów profesjonalną optymalizację SEO i zacznij przyciągać więcej klientów!
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
              question: "Jak szybko zauważę efekty optymalizacji SEO?",
              answer: "Pierwsze efekty optymalizacji SEO można zaobserwować po 4-6 tygodniach, ale pełne rezultaty są widoczne po 3-6 miesiącach."
            },
            {
              question: "Czy optymalizacja SEO jest jednorazowa?",
              answer: "Optymalizacja SEO to proces ciągły. Po wdrożeniu głównych zmian zaleca się regularne monitorowanie i dostosowywanie strategii."
            },
            {
              question: "Czy optymalizacja SEO obejmuje również tworzenie treści?",
              answer: "Optymalizacja może obejmować dostosowanie istniejących treści. Tworzenie nowych treści zazwyczaj realizowane jest jako oddzielna usługa copywritingu SEO."
            },
            {
              question: "Jak mierzycie efekty optymalizacji SEO?",
              answer: "Efekty mierzymy poprzez monitorowanie pozycji w wyszukiwarce, wzrost ruchu organicznego, poprawę współczynników konwersji i innych KPI."
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

export default SeoOptimization;
