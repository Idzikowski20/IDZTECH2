
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SeoCopywriting = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-premium-gradient bg-clip-text text-transparent">
            Copywriting SEO
          </h1>
          <p className="text-xl text-premium-light/80 leading-relaxed">
            Profesjonalne teksty, które sprzedają i pozycjonują. Wykorzystaj moc słów do zwiększenia widoczności w Google.
          </p>
          <div className="pt-6">
            <Button className="bg-premium-gradient hover:opacity-90 transition-all transform hover:scale-105" size="lg">
              Zamów copywriting SEO
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{
          animationDelay: "0.5s"
        }}>
            <h2 className="text-3xl font-bold">Dlaczego warto inwestować w copywriting SEO?</h2>
            <p className="text-premium-light/80">
              Copywriting SEO to tworzenie treści, które są atrakcyjne zarówno dla użytkowników, jak i dla wyszukiwarek. Profesjonalnie napisane teksty nie tylko angażują czytelników, ale także poprawiają widoczność Twojej strony w Google.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Treści optymalizowane pod kluczowe frazy</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Teksty angażujące użytkowników i budujące zaufanie</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Unikalne treści zgodne z wytycznymi Google</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Poprawa współczynnika konwersji</p>
              </li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{
          animationDelay: "0.7s"
        }}>
            <img src="https://img.freepik.com/free-vector/content-structure-concept-illustration_114360-8164.jpg" alt="Copywriting SEO - ilustracja" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Rodzaje tekstów SEO</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
          title: "Treści na stronę główną",
          description: "Angażujące treści wprowadzające, prezentujące firmę i jej ofertę."
        }, {
          title: "Opisy kategorii i produktów",
          description: "Unikalne i perswazyjne opisy zwiększające współczynnik konwersji."
        }, {
          title: "Artykuły blogowe",
          description: "Wartościowe treści przyciągające użytkowników i budujące autorytet."
        }, {
          title: "Teksty na landing page",
          description: "Treści zorientowane na konwersję i działanie użytkownika."
        }, {
          title: "Case studies i poradniki",
          description: "Rozbudowane materiały edukacyjne budujące wizerunek eksperta."
        }, {
          title: "Treści contentowe na linkbuilding",
          description: "Artykuły sponsorowane i gościnne optymalizowane pod linkowanie."
        }].map((service, index) => <Card key={index} className="border border-premium-dark/10  transition-all hover:border-premium-purple rounded-xl animate-fade-in" style={{
          animationDelay: `${0.5 + index * 0.2}s`
        }}>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-premium-purple">{service.title}</h3>
                <p className="text-premium-light/80">{service.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-12">Jak tworzymy treści SEO?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {[{
            step: "1",
            title: "Analiza słów kluczowych",
            description: "Badamy frazy i intencje użytkowników, aby dopasować treści do potrzeb."
          }, {
            step: "2",
            title: "Planowanie struktury",
            description: "Opracowujemy optymalną strukturę tekstu z nagłówkami i podpunktami."
          }, {
            step: "3",
            title: "Tworzenie treści",
            description: "Doświadczeni copywriterzy piszą angażujące, unikalne treści."
          }, {
            step: "4",
            title: "Optymalizacja i korekta",
            description: "Tekst przechodzi proces optymalizacji i korekty przed publikacją."
          }].map((item, index) => <div key={index} className="flex gap-6 animate-fade-in" style={{
            animationDelay: `${0.5 + index * 0.2}s`
          }}>
                <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center shrink-0">
                  <span className="font-bold text-premium-light">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-premium-light/80">{item.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto mt-12 mb-12 bg-premium-gradient rounded-3xl">
        <div className="max-w-3xl mx-auto text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold text-white">Gotowy na treści, które sprzedają i pozycjonują?</h2>
          <p className="text-white/90 text-lg">
            Zamów profesjonalny copywriting SEO i zacznij przyciągać więcej klientów!
          </p>
          <Button className="bg-white text-premium-purple hover:bg-white/90 transition-all transform hover:scale-105">
            Zamów bezpłatną wycenę
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SeoCopywriting;
