import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaChartBar, FaSearch, FaUsers, FaCalendarAlt, FaHeading, FaClipboardCheck } from 'react-icons/fa';
import SplineSEO from '@/components/SplineSEO';
import { useTheme } from '@/utils/themeContext';
import { Link } from 'react-router-dom';

const ContentPlan = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-premium-blue font-medium">Content Plan</span>
              <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 bg-premium-gradient bg-clip-text text-transparent">
                Content Plan
              </h1>
              <p className="text-premium-light/80 text-lg mb-8">
                Strategiczne planowanie treści dla Twojego biznesu. Zbuduj silną obecność w sieci dzięki przemyślanej strategii content marketingu.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/contact">
                <Button 
                  className="bg-premium-gradient hover:opacity-90 transition-all group relative overflow-hidden"
                  size="lg"
                >
                  <span className="relative z-10 text-white">Zamów content plan</span>
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

      {/* Kafelki - co zawiera content plan */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Co zawiera content plan?</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Elementy profesjonalnego content planu</h2>
          <p className="text-premium-light/70 text-lg">
            Otrzymasz kompletny plan działań content marketingowych, który pozwoli Ci skutecznie budować widoczność i autorytet marki:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaChartBar size={40} color="#A259FF" />, title: 'Analiza konkurencji', desc: 'Badanie treści konkurencji i identyfikacja luk do wykorzystania.' },
            { icon: <FaSearch size={40} color="#00C2FF" />, title: 'Badanie słów kluczowych', desc: 'Określenie fraz, na które warto pozycjonować treści.' },
            { icon: <FaUsers size={40} color="#FFB800" />, title: 'Segmentacja odbiorców', desc: 'Precyzyjne określenie grup docelowych i ich potrzeb.' },
            { icon: <FaCalendarAlt size={40} color="#FF6B81" />, title: 'Harmonogram publikacji', desc: 'Dokładny kalendarz treści na minimum 3 miesiące.' },
            { icon: <FaHeading size={40} color="#00C2FF" />, title: 'Tematy i nagłówki', desc: 'Propozycje konkretnych tematów artykułów i nagłówków.' },
            { icon: <FaClipboardCheck size={40} color="#A259FF" />, title: 'Wytyczne dla treści', desc: 'Szczegółowe wskazówki dotyczące stylu, formatu i optymalizacji.' },
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

      {/* Proces content planu */}
      <section className="py-16 px-4 md:px-8 lg:px-16 container mx-auto rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Proces tworzenia content planu</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Analiza wstępna",
              description: "Badamy Twoją branżę, konkurencję i potrzeby odbiorców."
            },
            {
              title: "2. Badanie słów kluczowych",
              description: "Identyfikujemy frazy kluczowe o najwyższym potencjale."
            },
            {
              title: "3. Strategia treści",
              description: "Tworzymy spójną strategię content marketingową."
            },
            {
              title: "4. Harmonogram i wytyczne",
              description: "Opracowujemy szczegółowy plan publikacji z wytycznymi."
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

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden mx-[30px] rounded-[20px]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[120px] -z-10"></div>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">Gotowy na strategiczne podejście do treści?</h2>
            <p className="text-premium-light/70 text-lg mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
              Zamów profesjonalny content plan i zacznij budować swoją obecność w sieci!
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-premium-gradient hover:opacity-90 transition-opacity animate-fade-in group relative overflow-hidden"
                style={{animationDelay: "0.4s"}}
              >
                <span className="relative z-10 text-white">Zamów bezpłatną konsultację</span>
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

export default ContentPlan;
