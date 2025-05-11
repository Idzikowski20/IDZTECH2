
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const About = () => {
  const { theme } = useTheme();
  
  const stats = [
    { number: '200+', text: 'Zadowolonych klientów' },
    { number: '500+', text: 'Zrealizowanych projektów' },
    { number: '10+', text: 'Lat doświadczenia' },
    { number: '15+', text: 'Ekspertów w zespole' }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      {/* Light effects */}
      <div className="absolute top-40 left-20 w-24 h-24 bg-premium-purple/60 rounded-full blur-[50px] animate-pulse-slow"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-premium-blue/60 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
      <div className="absolute bottom-40 left-1/2 w-28 h-28 bg-premium-pink/60 rounded-full blur-[55px] animate-pulse-slow delay-300"></div>
      
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side with new image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/3f93b345-6750-4cdb-8e53-e7b4e8fdf0e9.png" 
                alt="Team working in office" 
                className="rounded-lg w-full object-cover animate-float"
              />
            </div>
            
            <div className="flex justify-center mt-8">
              <div className="grid grid-cols-4 gap-4 bg-premium-dark/60 backdrop-blur-sm rounded-xl py-6 px-4 relative z-10">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-center text-center animate-float"
                  >
                    <span className="text-2xl sm:text-3xl font-bold bg-premium-gradient text-transparent bg-clip-text">
                      {stat.number}
                    </span>
                    <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-black/70' : 'text-premium-light/70'} mt-1 max-w-[100px]`}>
                      {stat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Side Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-premium-purple font-medium">O IDZ.TECH</span>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Kompleksowa agencja marketingowa, która przynosi realne rezultaty
            </h2>
            
            <p className={`${theme === 'light' ? 'text-black/70' : 'text-premium-light/70'}`}>
              IDZ.TECH to zespół doświadczonych specjalistów z pasją do marketingu cyfrowego. Łączymy kreatywność z analitycznym podejściem, aby dostarczać rozwiązania, które nie tylko wyglądają dobrze, ale przede wszystkim działają efektywnie.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={22} className="text-premium-purple mt-1" />
                <div>
                  <h4 className="font-medium">Zorientowanie na rezultaty</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-black/70' : 'text-premium-light/70'}`}>Koncentrujemy się na osiąganiu wymiernych wyników dla Twojego biznesu.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle size={22} className="text-premium-purple mt-1" />
                <div>
                  <h4 className="font-medium">Transparentność działań</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-black/70' : 'text-premium-light/70'}`}>Zapewniamy pełną przejrzystość i regularne raporty z naszych działań.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle size={22} className="text-premium-purple mt-1" />
                <div>
                  <h4 className="font-medium">Zespół ekspertów</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-black/70' : 'text-premium-light/70'}`}>Nasi specjaliści posiadają certyfikaty i wieloletnie doświadczenie w branży.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Link to="/about">
                <Button 
                  className={`bg-premium-gradient transition-opacity ${theme === 'light' ? 'text-black hover:text-white' : 'text-white hover:text-white'}`}
                >
                  Poznaj nas lepiej
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
