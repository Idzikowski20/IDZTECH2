import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Award, Lightbulb, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const AboutUs = () => {
  const { theme } = useTheme();

  const teamMembers = [
    { 
      name: 'Patryk Idzikowski', 
      role: 'Web Developer',
      description: 'Ekspert z 10-letnim doświadczeniem w tworzeniu stron internetowych i optymalizacji SEO dla firm z różnych branż.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    },
    { 
      name: 'Lidia Śliwa', 
      role: 'Fullstack Developer',
      description: 'Ekspert z doświadczeniem w tworzeniu aplikacji pełnostackowych wykorzystujących najnowsze technologie.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    },
    { 
      name: 'Przemek Idzikowski', 
      role: 'QA',
      description: 'Specjalista od zapewnienia jakości z doświadczeniem w testowaniu aplikacji webowych i mobilnych.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    },
    { 
      name: 'Aleksandra Górecka', 
      role: 'Web Developer',
      description: 'Ekspert z doświadczeniem w tworzeniu stron internetowych i optymalizacji SEO dla firm z różnych branż.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80'
    },
    { 
      name: 'Jan Śliwa', 
      role: 'Sales Director',
      description: 'Doświadczony dyrektor sprzedaży z szeroką wiedzą w zakresie sprzedaży rozwiązań IT i marketingowych.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    }
  ];
  
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Poznaj <span className="bg-premium-gradient text-transparent bg-clip-text">IDZ.TECH</span> - Twojego partnera w web developmencie
              </h1>
              
              <p className="text-xl text-premium-light/80 mb-8">
                Jesteśmy zespołem pasjonatów tworzenia stron internetowych, którzy od lat pomagają firmom rozwijać się w świecie online. Naszą misją jest dostarczanie kompleksowych i skutecznych rozwiązań webowych.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                    Skontaktuj się z nami
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button className={`border border-gray-200 rounded-full px-8 py-6 transition-all duration-800 bg-transparent ${theme === 'light' ? 'text-black hover:bg-[#1A1F2C] hover:text-white' : 'text-slate-50 hover:bg-[#1A1F2C] hover:text-white'}`}>
                    Zobacz nasze realizacje
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                  alt="IDZ.TECH Team" 
                  className="w-full h-auto rounded-lg object-cover aspect-video" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Nasze wartości</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Na czym opieramy naszą pracę</h2>
            <p className="text-premium-light/70 text-lg">
              Nasze podejście do każdego projektu jest zorientowane na osiąganie wymiernych rezultatów. Kierujemy się następującymi wartościami:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:scale-110 duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partnerstwo</h3>
              <p className="text-premium-light/70">
                Traktujemy naszych klientów jak partnerów biznesowych. Twój sukces jest naszym sukcesem.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:scale-110 duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Award size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jakość</h3>
              <p className="text-premium-light/70">
                Dostarczamy usługi najwyższej jakości, dążąc do perfekcji w każdym aspekcie naszej pracy.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:scale-110 duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Lightbulb size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innowacyjność</h3>
              <p className="text-premium-light/70">
                Nieustannie śledzimy trendy i wprowadzamy innowacyjne rozwiązania do naszych projektów stron.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:scale-110 duration-300 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Clock size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Terminowość</h3>
              <p className="text-premium-light/70">
                Szanujemy czas naszych klientów i zawsze dotrzymujemy ustalonych terminów realizacji projektów.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Nasz Zespół</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Poznaj ekspertów IDZ.TECH</h2>
            <p className="text-premium-light/70 text-lg">
              Nasz zespół to doświadczeni specjaliści z dziedziny tworzenia stron internetowych i SEO, którzy łączą swoje umiejętności, aby zapewnić Ci najlepsze wyniki.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className={`bg-premium-dark/60 border border-white/10 rounded-xl overflow-hidden transition-transform hover:scale-110 duration-300 animate-fade-in animate-float-${index % 3 + 1}`} 
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`} 
                    className="w-full h-64 object-cover" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-premium-purple mb-3">{member.role}</p>
                  <p className="text-premium-light/70 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Us section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Dlaczego my?</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Co nas wyróżnia</h2>
            <p className="text-premium-light/70 text-lg">
              Wybierając IDZ.TECH, wybierasz firmę, która naprawdę dba o Twój biznes w sieci. Oto, co nas wyróżnia:
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col space-y-6">
                {[
                  "Indywidualne podejście do każdego klienta",
                  "Kompleksowa obsługa w zakresie stron WWW i SEO",
                  "Przejrzyste zasady współpracy",
                  "Regularne raportowanie wyników",
                  "Zespół certyfikowanych specjalistów",
                  "Ciągły rozwój i poszerzanie kompetencji"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-premium-purple mr-3 mt-1 flex-shrink-0" />
                    <p className="text-premium-light/80">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                    Skontaktuj się z nami
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
              <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="IDZ.TECH Workspace" 
                  className="w-full h-auto rounded-lg object-cover aspect-video" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
