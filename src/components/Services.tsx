
import React from 'react';
import { 
  Search, LineChart, Instagram, Globe, Mail, MousePointer, 
  Smartphone, Code, ShoppingCart, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, gradient }) => {
  return (
    <div className="group relative">
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl rounded-xl -z-10",
        gradient
      )}></div>
      <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full flex flex-col hover:border-white/20 transition-colors">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          gradient
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-premium-light/70 text-sm flex-grow">{description}</p>
        <div className="mt-4">
          <a href="#" className="inline-flex items-center text-sm font-medium">
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
          </a>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Search size={24} className="text-premium-light" />,
      title: "Pozycjonowanie SEO",
      description: "Poprawimy widoczność Twojej strony w wyszukiwarce Google i zwiększymy organiczny ruch.",
      gradient: "bg-gradient-to-r from-premium-purple to-premium-blue"
    },
    {
      icon: <LineChart size={24} className="text-premium-light" />,
      title: "Google Ads",
      description: "Stworzymy i zoptymalizujemy kampanie reklamowe, które przyciągną nowych klientów.",
      gradient: "bg-gradient-to-r from-premium-blue to-premium-pink"
    },
    {
      icon: <Instagram size={24} className="text-premium-light" />,
      title: "Social Media",
      description: "Kompleksowa obsługa kanałów społecznościowych i budowanie zaangażowanej społeczności.",
      gradient: "bg-gradient-to-r from-premium-pink to-premium-purple"
    },
    {
      icon: <Globe size={24} className="text-premium-light" />,
      title: "Strony www",
      description: "Projektujemy i tworzymy profesjonalne, szybkie i responsywne strony internetowe.",
      gradient: "bg-gradient-to-r from-premium-purple to-premium-blue"
    },
    {
      icon: <Mail size={24} className="text-premium-light" />,
      title: "Email Marketing",
      description: "Zwiększymy Twoją sprzedaż poprzez skuteczne kampanie email marketingowe.",
      gradient: "bg-gradient-to-r from-premium-blue to-premium-pink"
    },
    {
      icon: <MousePointer size={24} className="text-premium-light" />,
      title: "UX/UI Design",
      description: "Zaprojektujemy intuicyjne i atrakcyjne interfejsy, które zwiększą konwersje.",
      gradient: "bg-gradient-to-r from-premium-pink to-premium-purple"
    },
    {
      icon: <Smartphone size={24} className="text-premium-light" />,
      title: "Aplikacje mobilne",
      description: "Tworzymy natywne i cross-platformowe aplikacje mobilne dla biznesu.",
      gradient: "bg-gradient-to-r from-premium-purple to-premium-blue"
    },
    {
      icon: <Code size={24} className="text-premium-light" />,
      title: "Web Development",
      description: "Programowanie zaawansowanych rozwiązań webowych dostosowanych do potrzeb.",
      gradient: "bg-gradient-to-r from-premium-blue to-premium-pink"
    },
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Co oferujemy</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Nasze usługi marketingowe</h2>
          <p className="text-premium-light/70 text-lg">
            Oferujemy kompleksowe rozwiązania, które pomogą Twojej firmie zyskać przewagę konkurencyjną i zwiększyć sprzedaż.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              gradient={service.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
