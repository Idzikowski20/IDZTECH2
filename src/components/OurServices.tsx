
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const OurServices = () => {
  const { theme } = useTheme();
  
  const services = [
    {
      icon: "/lovable-uploads/325fdb7a-8d6f-42e4-b020-3e69480d2b58.png",
      title: "Tworzenie stron www",
      description: "Projektujemy i tworzymy profesjonalne, szybkie i responsywne strony internetowe.",
      link: "/web-development"
    },
    {
      icon: "/lovable-uploads/325fdb7a-8d6f-42e4-b020-3e69480d2b58.png",
      title: "Tworzenie sklepów internetowych",
      description: "Kompleksowe rozwiązania e-commerce dostosowane do potrzeb Twojego biznesu.",
      link: "/e-commerce"
    },
    {
      icon: "/lovable-uploads/325fdb7a-8d6f-42e4-b020-3e69480d2b58.png",
      title: "Pozycjonowanie SEO",
      description: "Poprawimy widoczność Twojej strony w wyszukiwarce Google i zwiększymy organiczny ruch.",
      link: "/seo"
    },
    {
      icon: "/lovable-uploads/325fdb7a-8d6f-42e4-b020-3e69480d2b58.png",
      title: "Pozycjonowanie lokalne",
      description: "Zwiększ widoczność swojego biznesu w lokalnych wynikach wyszukiwania Google.",
      link: "/local-seo"
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
                rounded-xl p-6 flex flex-col transition-all duration-300 hover:transform hover:scale-105`}
            >
              <div className="mb-4 flex justify-start">
                <img 
                  src={service.icon} 
                  alt={service.title} 
                  className="w-16 h-16 object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className={`mb-4 flex-grow ${theme === 'light' ? 'text-gray-700' : 'text-premium-light/70'}`}>
                {service.description}
              </p>
              <Link 
                to={service.link} 
                className={`inline-flex items-center ${theme === 'light' ? 'text-premium-purple hover:bg-black hover:text-white p-1 rounded' : 'text-premium-purple hover:bg-white hover:text-black p-1 rounded'}`}
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
