
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Target, Search, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GoogleAdsCampaigns = () => {
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="text-premium-purple font-medium">Google Ads</span>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-3 mb-6">
                Skuteczne kampanie <span className="bg-premium-gradient text-transparent bg-clip-text">Google Ads</span> dla Twojego biznesu
              </h1>
              
              <p className="text-xl text-premium-light/80 mb-8">
                Zwiększ sprzedaż i pozyskaj nowych klientów dzięki profesjonalnie prowadzonym kampaniom reklamowym w Google. Dotrzemy do Twoich potencjalnych klientów dokładnie w momencie, gdy szukają produktów lub usług takich jak Twoje.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                    Darmowa konsultacja
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10 rounded-full px-8 py-6 text-slate-50 bg-black/0">
                    Zobacz realizacje
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Certyfikowany Partner Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Kampanie zorientowane na konwersje</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Pełna transparentność działań</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
                <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Google Ads Campaign Dashboard" 
                    className="w-full h-auto rounded-lg object-cover aspect-video" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Nasze usługi</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Rodzaje kampanii Google Ads</h2>
            <p className="text-premium-light/70 text-lg">
              Tworzymy i optymalizujemy różne rodzaje kampanii reklamowych w Google, dopasowane do Twoich celów biznesowych i branży:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Search size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie w sieci wyszukiwania</h3>
              <p className="text-premium-light/70">
                Reklamy tekstowe wyświetlane w wynikach wyszukiwania Google, gdy potencjalni klienci szukają produktów lub usług takich jak Twoje.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie remarketingowe</h3>
              <p className="text-premium-light/70">
                Docieraj ponownie do osób, które już odwiedziły Twoją stronę, przypominając im o Twojej ofercie i zachęcając do powrotu.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <BarChart size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie produktowe</h3>
              <p className="text-premium-light/70">
                Prezentuj swoje produkty w Google Shopping, pokazując zdjęcia, ceny i informacje o sklepie bezpośrednio w wynikach wyszukiwania.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie PLA</h3>
              <p className="text-premium-light/70">
                Specjalistyczne kampanie produktowe dla e-commerce, które zwiększają widoczność Twoich produktów w wynikach wyszukiwania.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie w sieci reklamowej</h3>
              <p className="text-premium-light/70">
                Docieraj do użytkowników poprzez reklamy graficzne, banery i wideo na stronach partnerskich Google i w aplikacjach.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '1.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Search size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie lokalne</h3>
              <p className="text-premium-light/70">
                Zwiększ widoczność swojej firmy w lokalnych wynikach wyszukiwania i na Mapach Google, aby przyciągnąć klientów z okolicy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Nasz proces</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Jak tworzymy skuteczne kampanie Google Ads</h2>
            <p className="text-premium-light/70 text-lg">
              Nasza metodologia oparta jest na doświadczeniu i ciągłym doskonaleniu kampanii, aby osiągnąć jak najlepsze wyniki dla Twojego biznesu.
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Analiza i strategia",
                description: "Badamy Twoją branżę, konkurencję i grupę docelową, aby stworzyć skuteczną strategię kampanii Google Ads.",
                delay: "0.6s"
              },
              {
                step: "02",
                title: "Konfiguracja kampanii",
                description: "Ustawiamy strukturę kampanii, grupy reklam, słowa kluczowe i tworzymy angażujące treści reklamowe.",
                delay: "0.7s"
              },
              {
                step: "03",
                title: "Optymalizacja i testy",
                description: "Nieustannie monitorujemy i optymalizujemy kampanie, testując różne podejścia, aby uzyskać najlepsze wyniki.",
                delay: "0.8s"
              },
              {
                step: "04",
                title: "Raportowanie i analiza",
                description: "Dostarczamy przejrzyste raporty z wynikami kampanii, analizujemy dane i wprowadzamy niezbędne korekty.",
                delay: "0.9s"
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start gap-6 animate-fade-in" style={{ animationDelay: item.delay }}>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-premium-gradient flex items-center justify-center font-bold text-2xl">
                  {item.step}
                </div>
                <div className="md:flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-premium-light/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
            <Link to="/contact">
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                Rozpocznij współpracę
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Korzyści</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Dlaczego warto zainwestować w Google Ads?</h2>
            <p className="text-premium-light/70 text-lg">
              Google Ads to jedna z najskuteczniejszych form reklamy online, która przynosi wymierne rezultaty dla Twojego biznesu:
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8">
              <div className="space-y-6">
                {[
                  "Natychmiastowe wyniki - Twoje reklamy są widoczne od razu po uruchomieniu kampanii",
                  "Precyzyjne targetowanie - docieraj tylko do osób zainteresowanych Twoją ofertą",
                  "Pełna kontrola nad budżetem - płacisz tylko za kliknięcia w reklamę",
                  "Mierzalne rezultaty - śledzenie konwersji i dokładne ROI",
                  "Możliwość szybkiej modyfikacji kampanii i testowania różnych podejść",
                  "Dotarcie do klientów dokładnie w momencie, gdy poszukują Twoich usług"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-premium-purple mr-3 mt-1 flex-shrink-0" />
                    <p className="text-premium-light/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
              <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80" 
                  alt="Google Ads Benefits" 
                  className="w-full h-auto rounded-lg object-cover aspect-video" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-premium-gradient opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/30 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Zacznij już dziś</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-6">
              Gotowy na zwiększenie sprzedaży dzięki Google Ads?
            </h2>
            <p className="text-premium-light/70 text-lg mb-8 max-w-2xl mx-auto">
              Skontaktuj się z nami już dziś i dowiedz się, jak możemy pomóc Twojemu biznesowi osiągnąć sukces dzięki profesjonalnie prowadzonym kampaniom Google Ads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                  Darmowa konsultacja
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/google-ads-audit">
                <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10 rounded-full px-8 py-6 text-slate-50 bg-black/0">
                  Audyt Google Ads
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default GoogleAdsCampaigns;
