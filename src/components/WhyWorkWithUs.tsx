import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const WhyWorkWithUs = () => {
  const { theme } = useTheme();
  
  const stats = [
    { number: '200+', text: 'Zadowolonych klientów' },
    { number: '500+', text: 'Zrealizowanych projektów' },
    { number: '10+', text: 'Lat doświadczenia' },
    { number: '15+', text: 'Ekspertów w zespole' }
  ];

  const teamMembers = [
    { 
      name: 'Patryk Idzikowski', 
      role: 'Frontend Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    },
    { 
      name: 'Lidia Śliwa', 
      role: 'Full Stack Developer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    },
    { 
      name: 'Przemek Idzikowski', 
      role: 'Inżynier QA',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    },
    { 
      name: 'Aleksandra Górecka', 
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80'
    },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/0a84b382-c65c-4f3a-bfdc-56f91938ef33.png" 
                alt="Team collaboration" 
                className="rounded-lg w-full object-cover"
              />
            </div>
            
            <div className="flex justify-center mt-8">
              <div className="grid grid-cols-4 gap-4 bg-premium-dark/60 rounded-xl py-6 px-4 relative z-10">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-2xl sm:text-3xl font-bold bg-premium-gradient text-transparent bg-clip-text">
                      {stat.number}
                    </span>
                    <span className="text-xs sm:text-sm text-premium-light/70 mt-1 max-w-[100px]">
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
            
            <p className="text-premium-light/70">
              IDZ.TECH to zespół doświadczonych specjalistów z pasją do marketingu cyfrowego. Łączymy kreatywność z analitycznym podejściem, aby dostarczać rozwiązania, które nie tylko wyglądają dobrze, ale przede wszystkim działają efektywnie.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={22} className="text-premium-purple mt-1" />
                <div>
                  <h4 className="font-medium">Zorientowanie na rezultaty</h4>
                  <p className="text-sm text-premium-light/70">Koncentrujemy się na osiąganiu wymiernych wyników dla Twojego biznesu.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle size={22} className="text-premium-purple mt-1" />
                <div>
                  <h4 className="font-medium">Transparentność działań</h4>
                  <p className="text-sm text-premium-light/70">Zapewniamy pełną przejrzystość i regularne raporty z naszych działań.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle size={22} className="text-premium-purple mt-1" />
                <div>
                  <h4 className="font-medium">Zespół ekspertów</h4>
                  <p className="text-sm text-premium-light/70">Nasi specjaliści posiadają certyfikaty i wieloletnie doświadczenie w branży.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Link to="/about">
                <Button 
                  className={`bg-premium-gradient hover:opacity-90 transition-opacity ${theme === 'light' ? 'text-black hover:text-white' : 'text-white hover:text-white'}`}
                >
                  Poznaj nas lepiej
                </Button>
              </Link>
            </div>

            {/* Team Members Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Poznaj naszych ekspertów</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-premium-dark/40"
                  >
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-16 h-16 object-cover rounded-full border-2 border-premium-purple/50" 
                    />
                    <div>
                      <h4 className={`font-medium ${theme === 'light' ? 'text-black hover:text-white' : 'text-white'}`}>{member.name}</h4>
                      <p className="text-sm text-premium-light/70">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;
