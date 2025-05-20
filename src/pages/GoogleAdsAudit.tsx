
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, BarChart3, Zap, CheckCircle, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const GoogleAdsAudit = () => {
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
                Profesjonalny <span className="bg-premium-gradient text-transparent bg-clip-text">Audyt Google Ads</span>
              </h1>
              
              <p className="text-xl text-premium-light/80 mb-8">
                Kompleksowa analiza Twoich kampanii reklamowych Google Ads, która pozwoli wykryć słabe punkty, zidentyfikować możliwości optymalizacji i zwiększyć efektywność Twoich działań reklamowych.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                    Zamów audyt
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/google-ads-campaigns">
                  <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10 rounded-full px-8 py-6 text-slate-50 bg-black/0">
                    Kampanie Google Ads
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Certyfikowani specjaliści Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Kompleksowy raport</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Konkretne rekomendacje</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
                <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Google Ads Audit" 
                    className="w-full h-auto rounded-lg object-cover aspect-video" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* What we analyze section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Audyt Google Ads</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Co analizujemy podczas audytu?</h2>
            <p className="text-premium-light/70 text-lg">
              Nasz audyt Google Ads obejmuje kompleksową analizę wszystkich elementów Twoich kampanii reklamowych, aby zidentyfikować obszary wymagające optymalizacji.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Search size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiza słów kluczowych</h3>
              <p className="text-premium-light/70">
                Badamy Twoje słowa kluczowe pod kątem ich efektywności, trafności i kosztów. Identyfikujemy słowa, które generują konwersje oraz te, które niepotrzebnie zużywają budżet.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <FileSearch size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ocena jakości reklam</h3>
              <p className="text-premium-light/70">
                Sprawdzamy, czy Twoje reklamy są angażujące, zgodne z intencją wyszukiwania i czy zawierają odpowiednie elementy, takie jak rozszerzenia reklam i wezwania do działania.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiza budżetu i stawek</h3>
              <p className="text-premium-light/70">
                Oceniamy, czy Twój budżet jest efektywnie rozdysponowany pomiędzy kampanie i grupy reklam, a także czy stawki są optymalne dla uzyskania najlepszego ROI.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Śledzenie konwersji</h3>
              <p className="text-premium-light/70">
                Sprawdzamy, czy konwersje są prawidłowo skonfigurowane i czy wszystkie istotne działania użytkowników są śledzone, co pozwala na podejmowanie decyzji opartych na danych.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Search size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Struktura konta</h3>
              <p className="text-premium-light/70">
                Analizujemy, czy kampanie i grupy reklam są logicznie zorganizowane, co ma bezpośredni wpływ na efektywność kampanii i łatwość zarządzania nimi.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '1.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiza konkurencji</h3>
              <p className="text-premium-light/70">
                Badamy działania reklamowe Twojej konkurencji, aby zidentyfikować możliwości i zagrożenia, które mogą wpływać na efektywność Twoich kampanii.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Audit process section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="text-premium-purple font-medium">Nasz proces</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Jak przebiega audyt Google Ads?</h2>
            <p className="text-premium-light/70 text-lg">
              Poznaj kolejne etapy naszego audytu, który dostarczy Ci cennych informacji o tym, jak poprawić efektywność Twoich kampanii Google Ads.
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Dostęp i dane wejściowe",
                description: "Otrzymujemy od Ciebie dostęp do konta Google Ads oraz informacje o Twoich celach biznesowych i oczekiwaniach.",
                delay: "0.6s"
              },
              {
                step: "02",
                title: "Szczegółowa analiza",
                description: "Nasi specjaliści przeprowadzają dogłębną analizę wszystkich elementów Twoich kampanii reklamowych.",
                delay: "0.7s"
              },
              {
                step: "03",
                title: "Opracowanie rekomendacji",
                description: "Na podstawie zebranych danych przygotowujemy konkretne rekomendacje działań optymalizacyjnych.",
                delay: "0.8s"
              },
              {
                step: "04",
                title: "Prezentacja wyników",
                description: "Przedstawiamy Ci szczegółowy raport z audytu wraz z omówieniem najważniejszych wniosków i rekomendacji.",
                delay: "0.9s"
              },
              {
                step: "05",
                title: "Wdrożenie zmian (opcjonalnie)",
                description: "Na Twoje życzenie możemy pomóc we wdrożeniu rekomendowanych zmian lub przejąć kompleksowe zarządzanie kampaniami.",
                delay: "1s"
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
          
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '1.1s' }}>
            <Link to="/contact">
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                Zamów audyt Google Ads
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
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Co zyskujesz dzięki audytowi?</h2>
            <p className="text-premium-light/70 text-lg">
              Audyt Google Ads to inwestycja, która szybko się zwraca dzięki zwiększonej efektywności Twoich kampanii reklamowych:
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8">
              <div className="space-y-6">
                {[
                  "Obniżenie kosztów pozyskania klienta (CPA) poprzez eliminację nieskutecznych słów kluczowych",
                  "Zwiększenie współczynnika konwersji dzięki poprawie jakości reklam i stron docelowych",
                  "Efektywniejsze wykorzystanie budżetu reklamowego i lepszy zwrot z inwestycji",
                  "Identyfikacja nowych możliwości rozwoju kampanii i dotarcia do nowych grup odbiorców",
                  "Lepsze zrozumienie zachowań Twoich klientów w internecie",
                  "Konkretne wskazówki, jak poprawić skuteczność Twoich działań reklamowych"
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
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Google Ads Audit Benefits" 
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
              Gotowy na profesjonalny audyt Twoich kampanii?
            </h2>
            <p className="text-premium-light/70 text-lg mb-8 max-w-2xl mx-auto">
              Skontaktuj się z nami już dziś i dowiedz się, jak możemy pomóc Ci zwiększyć efektywność Twoich kampanii Google Ads dzięki profesjonalnemu audytowi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                  Zamów audyt
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/google-ads-campaigns">
                <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10 rounded-full px-8 py-6 text-slate-50 bg-black/0">
                  Kampanie Google Ads
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

export default GoogleAdsAudit;
