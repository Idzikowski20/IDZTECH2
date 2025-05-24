import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const FAQ = () => {
  const { theme } = useTheme();
  const faqItems = [{
    question: "Stawiamy na Twój biznes i realne efekty",
    answer: "Każdy projekt strony lub sklepu internetowego realizujemy z myślą o Twoich celach – większej sprzedaży, lepszej widoczności w Google, rozwoju firmy. Proponujemy rozwiązania, które naprawdę działają i pomagają rosnąć Twojemu biznesowi."
  }, {
    question: "Indywidualne podejście do każdej branży i firmy",
    answer: "Analizujemy specyfikę Twojej branży i dobieramy technologie oraz rozwiązania, które najlepiej sprawdzą się w Twoim przypadku. Nie korzystamy z gotowych szablonów – każda strona i sklep są projektowane na miarę."
  }, {
    question: "Partnerska współpraca na każdym etapie",
    answer: "Współpracujemy z Tobą jak partnerzy – słuchamy Twoich potrzeb, doradzamy i wspólnie planujemy rozwój strony, sklepu lub działań SEO. Zależy nam na długofalowych relacjach i Twoim sukcesie."
  }, {
    question: "Jak długo trwa realizacja strony lub sklepu?",
    answer: "Czas realizacji zależy od zakresu projektu. Proste strony wykonujemy w 2-3 tygodnie, rozbudowane sklepy w 4-6 tygodni. Pozycjonowanie i SEO to proces długofalowy, pierwsze efekty widoczne są zwykle po kilku miesiącach."
  }, {
    question: "Transparentność i jasne wyceny",
    answer: "Zawsze przedstawiamy szczegółową wycenę przed rozpoczęciem współpracy. Nie ma ukrytych kosztów, a raporty z postępów są przejrzyste i zrozumiałe."
  }, {
    question: "Zespół specjalistów od stron, sklepów i SEO",
    answer: "Nasz zespół to doświadczeni programiści, graficy, copywriterzy i specjaliści SEO. Każdy projekt realizujemy kompleksowo – od projektu graficznego, przez wdrożenie, po optymalizację i wsparcie techniczne."
  }];

  return (
    <section className="py-20 relative overflow-hidden">
      

      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Dlaczego warto</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">z nami pracować:</h2>
          <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'} text-lg`}>
            Tutaj znajdziesz kilka kluczowych powodów dlaczego warto z nami współpracować
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - FAQ */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className={`${theme === 'light' ? 'border-gray-300' : 'border-white/10'}`}
                >
                  <AccordionTrigger 
                    className={`text-xl font-medium py-4 hover:no-underline hover:text-premium-purple text-left ${theme === 'light' ? 'text-black' : 'text-white'}`}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'} accordion-content`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Side - CTA */}
          <div className={`${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'bg-premium-dark/60 border-white/10'} rounded-xl p-8 h-full flex flex-col justify-center`}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Nowoczesne strony, sklepy i skuteczne pozycjonowanie</h3>
              <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'}`}>
                Tworzymy profesjonalne strony internetowe i sklepy online, które nie tylko świetnie wyglądają, ale są też zoptymalizowane pod SEO i konwersję. Poprawiamy widoczność w Google, zajmujemy się pozycjonowaniem, optymalizacją techniczną oraz skutecznym copywritingiem. Zadbaj o rozwój swojego biznesu w internecie z Premium Digital Harvest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                    Darmowa konsultacja
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button className="border border-black text-black rounded-full px-8 py-6 transition-all duration-800 bg-transparent hover:bg-black hover:text-white dark:border-gray-200 dark:text-slate-50 dark:hover:bg-white dark:hover:text-black">
                    Zobacz nasze realizacje
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
