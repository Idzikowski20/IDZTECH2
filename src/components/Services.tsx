
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

// Since we don't have the original file, I'll create a basic Services component with shadow effects
const Services = () => {
  const { theme } = useTheme();
  
  const services = [
    {
      title: 'Strony WWW',
      description: 'Projektujemy i wdrażamy nowoczesne, responsywne strony internetowe dostosowane do Twoich potrzeb.',
      link: '/tworzenie-stron-www',
      icon: '🌐'
    },
    {
      title: 'Sklepy Internetowe',
      description: 'Tworzymy funkcjonalne sklepy e-commerce, które zwiększają sprzedaż i poprawiają doświadczenie klienta.',
      link: '/sklepy-internetowe',
      icon: '🛒'
    },
    {
      title: 'Pozycjonowanie SEO',
      description: 'Zwiększamy widoczność Twojej strony w wynikach wyszukiwania, co przekłada się na więcej klientów.',
      link: '/pozycjonowanie-stron',
      icon: '📈'
    },
    {
      title: 'Kampanie Google Ads',
      description: 'Prowadzimy skuteczne kampanie reklamowe, które generują ruch i konwersje dla Twojej firmy.',
      link: '/kampanie-google-ads',
      icon: '🎯'
    }
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-premium-purple font-medium">Nasze usługi</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
            Kompleksowe rozwiązania dla Twojego biznesu online
          </h2>
          <p className="text-premium-light/70">
            Oferujemy szeroki zakres usług webowych, marketingowych i developerskich, aby pomóc Twojej firmie wyróżnić się w internecie.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 hover:bg-premium-dark/80 transition-all duration-300 h-full flex flex-col shadow-lg shadow-premium-purple/10"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-premium-light/70 mb-6 flex-1">{service.description}</p>
              <Link to={service.link}>
                <Button 
                  variant="ghost" 
                  className={`p-0 ${theme === 'light' ? 'text-premium-dark hover:text-premium-purple hover:bg-transparent' : 'text-premium-light hover:text-premium-purple hover:bg-transparent'}`}
                >
                  Dowiedz się więcej
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
