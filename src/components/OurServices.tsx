
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, ShoppingCart, Search, MapPin, FileText, Component, BarChart3 } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const OurServices = () => {
  const { theme } = useTheme();
  
  const services = [
    {
      icon: <Code className="w-10 h-10 text-premium-purple" />,
      title: "Tworzenie stron www",
      description: "Projektujemy i tworzymy profesjonalne, szybkie i responsywne strony internetowe.",
      link: "/tworzenie-stron-www"
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-premium-blue" />,
      title: "Tworzenie sklepów internetowych",
      description: "Kompleksowe rozwiązania e-commerce dostosowane do potrzeb Twojego biznesu.",
      link: "/sklepy-internetowe"
    },
    {
      icon: <Search className="w-10 h-10 text-premium-pink" />,
      title: "Pozycjonowanie SEO",
      description: "Poprawimy widoczność Twojej strony w wyszukiwarce Google i zwiększymy organiczny ruch.",
      link: "/pozycjonowanie-stron"
    },
    {
      icon: <MapPin className="w-10 h-10 text-green-500" />,
      title: "Pozycjonowanie lokalne",
      description: "Zwiększ widoczność swojego biznesu w lokalnych wynikach wyszukiwania Google.",
      link: "/pozycjonowanie-lokalne"
    },
    {
      icon: <FileText className="w-10 h-10 text-orange-500" />,
      title: "Audyt SEO",
      description: "Szczegółowa analiza Twojej strony pod kątem SEO z konkretnymi rekomendacjami zmian.",
      link: "/audyt-seo"
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
      title: "Optymalizacja SEO",
      description: "Kompleksowa optymalizacja techniczna Twojej strony pod kątem wymagań wyszukiwarek.",
      link: "/optymalizacja-seo"
    },
    {
      icon: <Component className="w-10 h-10 text-purple-500" />,
      title: "Copywriting SEO",
      description: "Tworzenie angażujących treści zoptymalizowanych pod kątem wyszukiwarek.",
      link: "/copywriting-seo"
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-teal-500" />,
      title: "Content Plan",
      description: "Strategiczne planowanie treści, które przyciągną czytelników i zwiększą konwersje.",
      link: "/content-plan"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-premium-purple font-medium mb-3">Co oferujemy</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Nasze usługi webowe</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70 dark:text-premium-light/70 light:text-premium-dark">
            Oferujemy kompleksowe rozwiązania, które pomogą Twojej firmie zyskać przewagę konkurencyjną w internecie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'bg-premium-dark/40'} 
                rounded-xl p-6 flex flex-col transition-all duration-300 hover:scale-105`}
            >
              <div className="mb-4 flex justify-start">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className={`mb-4 flex-grow ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/70'}`}>
                {service.description}
              </p>
              <Link 
                to={service.link} 
                className="inline-flex items-center text-premium-purple hover:text-white hover:bg-premium-light/5 border-radius20"
              >
                <span>Dowiedz się więcej</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
