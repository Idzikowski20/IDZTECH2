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
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Dlaczego warto <span className="bg-premium-gradient text-transparent bg-clip-text">wybrać nas?</span>
            </h2>
            <p className={`text-lg mb-8 ${theme === 'light' ? 'text-black/70' : 'text-premium-light/70'}`}>
              Jesteśmy zespołem pasjonatów, którzy kochają tworzyć wyjątkowe strony internetowe. Nasza praca to nie tylko kod - to sztuka tworzenia cyfrowych doświadczeń.
            </p>
            
            <div className="flex justify-center mt-8">
              <div className="grid grid-cols-4 gap-4 bg-premium-dark/60 rounded-xl py-6 px-4 relative z-10">
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
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                <img 
                  src="/lovable-uploads/0a84b382-c65c-4f3a-bfdc-56f91938ef33.png" 
                  alt="Team collaboration" 
                  className="rounded-lg w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
