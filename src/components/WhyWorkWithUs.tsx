import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const WhyWorkWithUs = () => {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const stats = [
    { number: '50+', text: 'Zadowolonych klientów' },
    { number: '20+', text: 'Zrealizowanych projektów' },
    { number: '10+', text: 'Lat doświadczenia' },
    { number: '5+', text: 'Ekspertów w zespole' }
  ];

  const teamMembers = [
    { 
      name: 'Patryk Idzikowski', 
      role: 'Frontend Developer',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQFN5Z-Q4Ty3tw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1709119468661?e=1753315200&v=beta&t=MD-IXRwVN_OjQQf96usS4ZJBJ80W5MAMnbZzOu9aUDw'
    },
    { 
      name: 'Lidia Śliwa', 
      role: 'FullStack Developer',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQEYvQq3t6S4sw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1709115564928?e=1753315200&v=beta&t=g0_qDY8HNzH53iK90feqkCEfshLCLuSX4gUz_ZV_I0s'
    },
    { 
      name: 'Przemek Idzikowski', 
      role: 'QA',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQHnAB-xHjZuzQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1709126469495?e=1753315200&v=beta&t=j37jqhIfKlFX0WGqpowFNCQuYsNoV6XZ5SHISjU2Kig'
    },
    { 
      name: 'Aleksandra Górecka', 
      role: 'Marketing Specjalist',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQGXIT6Ts4PNKA/profile-displayphoto-shrink_200_200/B4DZOGr_alG0Ac-/0/1733131499592?e=1753315200&v=beta&t=pG5ndvFbqCngCLfXaRdUm7mpm_RQdcHjWfvoJn8uwy8'
    },
    { 
      name: 'Jan Śliwa', 
      role: 'Sales Director',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQEODWoax6O9kQ/profile-displayphoto-shrink_200_200/B4EZTNI7ExGYAY-/0/1738608456657?e=1753315200&v=beta&t=xSesI6rQTiqm13EsbJL-xN9vN5ye5aFNoz2__83lG9U'
    },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Nagłówek i opis na całą szerokość */}
        <div className="mb-20 max-w-4xl mx-auto text-center">
          <span className="text-premium-purple font-medium block mb-2">O IDZTECH</span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Kompleksowa firma tworząca strony i sklepy internetowe
          </h2>
          <p className="text-premium-light/70 mb-6">
            IDZTECH to zespół doświadczonych specjalistów z pasją do tworzenia nowoczesnych stron i sklepów internetowych. Łączymy kreatywność z analitycznym podejściem, aby dostarczać rozwiązania, które nie tylko wyglądają dobrze, ale przede wszystkim działają efektywnie.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-start gap-3 justify-center">
              <CheckCircle size={22} className="text-premium-purple mt-1" />
              <div>
                <h4 className="font-medium">Zorientowanie na rezultaty</h4>
                <p className="text-sm text-premium-light/70">Koncentrujemy się na osiąganiu wymiernych wyników dla Twojego biznesu.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-center">
              <CheckCircle size={22} className="text-premium-purple mt-1" />
              <div>
                <h4 className="font-medium">Transparentność działań</h4>
                <p className="text-sm text-premium-light/70">Zapewniamy pełną przejrzystość i regularne raporty z naszych działań.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-center">
              <CheckCircle size={22} className="text-premium-purple mt-1" />
              <div>
                <h4 className="font-medium">Zespół ekspertów</h4>
                <p className="text-sm text-premium-light/70">Nasi specjaliści posiadają certyfikaty i wieloletnie doświadczenie w branży.</p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Link to="/about">
              <Button 
                className={`bg-premium-gradient hover:opacity-90 transition-opacity text-white hover:text-white`}
              >
                Poznaj nas lepiej
              </Button>
            </Link>
          </div>
        </div>
        {/* Grid 2 kolumny: lewa - film + statystyki, prawa - eksperci */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-start">
          {/* Lewa kolumna: film + statystyki */}
          <div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-3xl aspect-video mx-auto">
                <video
                  ref={videoRef}
                  src="/video/0524.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
                  style={{ background: '#000' }}
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="grid grid-cols-4 gap-4 rounded-xl py-6 px-4 relative z-10 shadow-md">
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
          {/* Prawa kolumna: eksperci */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Nasz zespół ekspertów</h3>
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
                    width="64"
                    height="64"
                    loading="lazy"
                  />
                  <div>
                    <h4 className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>{member.name}</h4>
                    <p className="text-sm text-premium-light/70">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;
