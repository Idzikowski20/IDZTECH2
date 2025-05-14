
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ContentPlan = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 container mx-auto relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-premium-gradient bg-clip-text text-transparent">
            Content Plan
          </h1>
          <p className="text-xl text-premium-light/80 leading-relaxed">
            Strategiczne planowanie treści dla Twojego biznesu. Zbuduj silną obecność w sieci dzięki przemyślanej strategii content marketingu.
          </p>
          <div className="pt-6">
            <Button className="bg-premium-gradient hover:opacity-90 transition-all transform hover:scale-105" size="lg">
              Zamów content plan
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
            <h2 className="text-3xl font-bold">Czym jest content plan i dlaczego go potrzebujesz?</h2>
            <p className="text-premium-light/80">
              Content plan to strategiczny dokument określający jakie treści, kiedy i gdzie będziesz publikować. To fundament skutecznego content marketingu, który pozwala systematycznie budować widoczność w sieci i angażować odbiorców.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Spójny przekaz marki i komunikacji</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Strategiczne podejście do SEO i słów kluczowych</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Regularne publikacje budujące autorytet</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-premium-purple flex items-center justify-center mt-1">✓</div>
                <p>Oszczędność czasu i lepsze planowanie zasobów</p>
              </li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{
          animationDelay: "0.7s"
        }}>
            <img src="https://img.freepik.com/free-vector/content-concept-illustration_114360-1091.jpg" alt="Content Plan" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto bg-white rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">Co zawiera profesjonalny content plan?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[{
          title: "Analiza konkurencji",
          description: "Badanie treści konkurencji i identyfikacja luk do wykorzystania."
        }, {
          title: "Badanie słów kluczowych",
          description: "Określenie fraz, na które warto pozycjonować treści."
        }, {
          title: "Segmentacja odbiorców",
          description: "Precyzyjne określenie grup docelowych i ich potrzeb."
        }, {
          title: "Harmonogram publikacji",
          description: "Dokładny kalendarz treści na minimum 3 miesiące."
        }, {
          title: "Tematy i nagłówki",
          description: "Propozycje konkretnych tematów artykułów i nagłówków."
        }, {
          title: "Wytyczne dla treści",
          description: "Szczegółowe wskazówki dotyczące stylu, formatu i optymalizacji."
        }].map((item, index) => <Card key={index} className="border border-premium-light/10 bg-white hover:bg-white transition-all hover:border-premium-purple rounded-xl animate-fade-in" style={{
          animationDelay: `${0.5 + index * 0.2}s`
        }}>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-premium-purple">{item.title}</h3>
                <p className="text-black/80">{item.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-12">Proces tworzenia content planu</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {[{
            step: "1",
            title: "Analiza wstępna",
            description: "Badamy Twoją branżę, konkurencję i potrzeby odbiorców."
          }, {
            step: "2",
            title: "Badanie słów kluczowych",
            description: "Identyfikujemy frazy kluczowe o najwyższym potencjale."
          }, {
            step: "3",
            title: "Strategia treści",
            description: "Tworzymy spójną strategię content marketingową."
          }, {
            step: "4",
            title: "Harmonogram i wytyczne",
            description: "Opracowujemy szczegółowy plan publikacji z wytycznymi."
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
          <h2 className="text-3xl font-bold text-white">Gotowy na strategiczne podejście do treści?</h2>
          <p className="text-white/90 text-lg">
            Zamów profesjonalny content plan i zacznij budować swoją obecność w sieci!
          </p>
          <Button className="bg-white text-premium-purple hover:bg-white/90 transition-all transform hover:scale-105">
            Zamów bezpłatną konsultację
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentPlan;
