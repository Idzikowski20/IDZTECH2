import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
const FAQ = () => {
  const faqItems = [{
    question: "Jesteśmy skupieni na Twoich celach biznesowych",
    answer: "Każde działanie marketingowe planujemy pod kątem Twoich celów - sprzedaży, widoczności, skalowania lub pozyskiwania leadów. Dobieramy odpowiednie kanały marketingowe, aby jak najszybciej osiągać założone cele i skalować wyniki."
  }, {
    question: "Dobieramy rozwiązania do branży i potrzeb biznesu",
    answer: "Analizujemy specyfikę Twojej branży i dopasowujemy strategie marketingowe, które sprawdzają się w Twoim sektorze. Nasze rozwiązania są szyte na miarę - nie stosujemy uniwersalnych szablonów."
  }, {
    question: "Stawiamy na partnerstwo, nie na relację wykonawca-klient",
    answer: "Współpracujemy z Tobą jako partner biznesowy. Zależy nam na długoterminowych relacjach, dlatego angażujemy się w Twój biznes, poznajemy cele i wspólnie planujemy strategie rozwoju."
  }, {
    question: "Jak długo trwa realizacja projektu?",
    answer: "Czas realizacji projektu zależy od jego skali i złożoności. Zwykle strony internetowe tworzymy w 4-6 tygodni, kampanie reklamowe uruchamiamy w ciągu 1-2 tygodni, a działania SEO to proces długoterminowy, trwający minimum 6 miesięcy."
  }, {
    question: "Jesteśmy transparentni w działaniach i wycenach",
    answer: "Zawsze przedstawiamy jasne i szczegółowe wyceny. Raporty z działań są przejrzyste i zrozumiałe. Nie ukrywamy kosztów ani nie stosujemy niejasnych opłat - wiesz dokładnie za co płacisz."
  }, {
    question: "Posiadamy zespół wielkobszarowych specjalistów od Digital Marketingu",
    answer: "Nasz zespół tworzą doświadczeni specjaliści z różnych dziedzin marketingu internetowego - od programistów, przez grafików, copywriterów, po specjalistów SEO, PPC i mediów społecznościowych. Każdy projekt prowadzony jest przez ekspertów w swojej dziedzinie."
  }];
  return <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Dlaczego warto</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">z nami pracować:</h2>
          <p className="text-premium-light/70 text-lg">
            Tutaj znajdziesz kilka kluczowych powodów dlaczego warto pracować z naszą agencją marketingową
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - FAQ */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-xl font-medium py-4 hover:no-underline hover:text-premium-purple text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-premium-light/70">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>

          {/* Right Side - CTA */}
          <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full flex flex-col justify-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Kompleksowa agencja marketingowa, która przynosi realne rezultaty</h3>
              <p className="text-premium-light/70">
                Nasza agencja pomaga firmom rozwijać się online poprzez skuteczne strategie marketingowe. Niezależnie od wielkości Twojej firmy, pomożemy Ci osiągnąć cele biznesowe i zwiększyć sprzedaż.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                    Darmowa konsultacja
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button className="border border-gray-200 text-slate-50 rounded-full px-8 py-6 transition-all duration-800 bg-transparent hover:bg-[#1A1F2C] hover:text-white">
                    Zobacz nasze realizacje
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default FAQ;