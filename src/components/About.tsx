
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '200+', text: 'Zadowolonych klientów' },
    { number: '500+', text: 'Zrealizowanych projektów' },
    { number: '10+', text: 'Lat doświadczenia' },
    { number: '15+', text: 'Ekspertów w zespole' }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
                <div className="relative h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                    alt="Team meeting" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-premium-dark border border-white/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-1">Indywidualne podejście</h4>
                  <p className="text-sm text-premium-light/70">Każdy projekt traktujemy wyjątkowo</p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-premium-gradient rounded-xl blur-sm opacity-50"></div>
                  <div className="relative h-full">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                      alt="Team collaboration" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="grid grid-cols-4 gap-4 bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl py-6 px-4 -mt-24 relative z-10">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center justify-center text-center">
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
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity">
                Poznaj nas lepiej
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
