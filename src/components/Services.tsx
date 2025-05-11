
import React from 'react';
import { 
  Search, Globe, ShoppingCart, Building, Car, Briefcase, Scissors
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, gradient, link }) => {
  const { theme } = useTheme();
  
  return (
    <div className="group relative">
      <div className={`${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark/60 backdrop-blur-sm border-white/10'} rounded-xl p-6 h-full flex flex-col hover:border-white/20 transition-colors hover:scale-110 duration-300`}>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          gradient
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'} text-sm flex-grow`}>{description}</p>
        <div className="mt-4">
          <Link to={link} className={`inline-flex items-center text-sm font-medium ${theme === 'light' ? 'hover:text-black' : 'hover:text-white'} transition-colors`}>
            Dowiedz się więcej
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const { theme } = useTheme();
  
  const services = [
    {
      icon: <Globe size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Tworzenie stron www",
      description: "Projektujemy i tworzymy profesjonalne, szybkie i responsywne strony internetowe.",
      gradient: "bg-gradient-to-r from-premium-purple to-premium-blue",
      link: "/tworzenie-stron-www"
    },
    {
      icon: <ShoppingCart size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Tworzenie sklepów internetowych",
      description: "Kompleksowe rozwiązania e-commerce dostosowane do potrzeb Twojego biznesu.",
      gradient: "bg-gradient-to-r from-premium-blue to-premium-pink",
      link: "/tworzenie-sklepow-internetowych"
    },
    {
      icon: <Search size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Pozycjonowanie SEO",
      description: "Poprawimy widoczność Twojej strony w wyszukiwarce Google i zwiększymy organiczny ruch.",
      gradient: "bg-gradient-to-r from-premium-pink to-premium-purple",
      link: "/pozycjonowanie-stron-internetowych"
    }
  ];

  // Local business categories with icons
  const localBusinesses = [
    {
      icon: <Building size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Firmy budowlane",
      description: "Skuteczne pozycjonowanie lokalne dla firm z branży budowlanej i remontowej.",
      gradient: "bg-gradient-to-r from-premium-purple to-premium-blue",
      link: "/pozycjonowanie-lokalne"
    },
    {
      icon: <Scissors size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Salony piękności",
      description: "Zwiększ widoczność salonu fryzjerskiego lub kosmetycznego w lokalnych wynikach wyszukiwania.",
      gradient: "bg-gradient-to-r from-premium-blue to-premium-pink",
      link: "/pozycjonowanie-lokalne"
    },
    {
      icon: <Car size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Warsztaty samochodowe",
      description: "Pozyskaj więcej klientów z okolicy dla swojego warsztatu samochodowego.",
      gradient: "bg-gradient-to-r from-premium-pink to-premium-purple",
      link: "/pozycjonowanie-lokalne"
    },
    {
      icon: <Briefcase size={24} className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light'}`} />,
      title: "Gabinety medyczne",
      description: "Pozycjonowanie lokalne dla przychodni, gabinetów lekarskich i stomatologicznych.",
      gradient: "bg-gradient-to-r from-premium-purple to-premium-blue",
      link: "/pozycjonowanie-lokalne"
    }
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Background elements with fixed position */}
      <div className="fixed top-40 left-20 w-24 h-24 bg-premium-purple/60 rounded-full blur-[50px] animate-pulse-slow"></div>
      <div className="fixed top-20 right-20 w-32 h-32 bg-premium-blue/60 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
      <div className="fixed bottom-40 left-1/2 w-28 h-28 bg-premium-pink/60 rounded-full blur-[55px] animate-pulse-slow delay-300"></div>
      
      <div className="fixed top-1/2 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Co oferujemy</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Nasze usługi webowe</h2>
          <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'} text-lg`}>
            Oferujemy kompleksowe rozwiązania, które pomogą Twojej firmie zyskać przewagę konkurencyjną i zwiększyć sprzedaż online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              gradient={service.gradient}
              link={service.link}
            />
          ))}
        </div>
        
        {/* Local Business Types Section */}
        {location.pathname === "/pozycjonowanie-lokalne" && (
          <div className="mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-premium-purple font-medium">Branże</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Pozycjonowanie lokalne dla różnych branż</h2>
              <p className={`${theme === 'light' ? 'text-premium-dark' : 'text-premium-light/70'} text-lg`}>
                Specjalizujemy się w pozycjonowaniu lokalnym dla różnych typów biznesów. Sprawdź, jak możemy pomóc Twojej firmie.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {localBusinesses.map((business, index) => (
                <ServiceCard 
                  key={`local-${index}`}
                  icon={business.icon}
                  title={business.title}
                  description={business.description}
                  gradient={business.gradient}
                  link={business.link}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
