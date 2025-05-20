
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import FadeInSection from '@/components/FadeInSection';
import { Building, Store, Search, Shield, MapPin, Target, Users, Phone, Globe, Home } from 'lucide-react';
import CTA from '@/components/CTA';
import localSeoImage from '@/assets/local-seo.jpg';

const LocalSeo = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Pozycjonowanie Lokalne Google Maps - Usługi SEO | IDZ.TECH</title>
        <meta name="description" content="Zwiększ widoczność w lokalnych wynikach wyszukiwania Google Maps. Oferujemy kompleksowe usługi pozycjonowania lokalnego dla firm." />
      </Helmet>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-premium-dark overflow-hidden relative">
          {/* Background Elements */}
          <div className="absolute top-40 left-20 w-24 h-24 bg-premium-purple/60 rounded-full blur-[50px] animate-pulse-slow"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-premium-blue/60 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
          <div className="absolute bottom-40 left-1/2 w-28 h-28 bg-premium-pink/60 rounded-full blur-[55px] animate-pulse-slow delay-300"></div>
          
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Pozycjonowanie lokalne dla Twojej firmy
                </h1>
                
                <p className="text-xl text-premium-light/70 mb-8">
                  Zwiększ widoczność w lokalnych wynikach wyszukiwania Google Maps i przyciągnij klientów z Twojej okolicy.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a href="#form" className="inline-flex items-center px-6 py-3 rounded-lg bg-premium-gradient hover:opacity-90 transition-opacity font-medium text-white">
                    Bezpłatna konsultacja
                  </a>
                  <a href="#local-seo" className="inline-flex items-center px-6 py-3 rounded-lg bg-transparent border border-white/20 hover:bg-white/5 transition-all font-medium">
                    Dowiedz się więcej
                  </a>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-premium-purple/20 to-premium-blue/20 rounded-2xl p-1 shadow-lg">
                  <div className="bg-premium-dark/50 backdrop-blur-sm rounded-xl overflow-hidden">
                    <img 
                      src={localSeoImage} 
                      alt="Pozycjonowanie lokalne"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* What is Local SEO */}
        <section id="local-seo" className="py-24 bg-premium-dark/90 relative">
          <div className="container mx-auto px-4">
            <FadeInSection>
              <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center">
                Czym jest pozycjonowanie lokalne?
              </h2>
            </FadeInSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeInSection delay={0.1}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 h-full">
                  <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Widoczność na mapach Google</h3>
                  <p className="text-premium-light/70">
                    Pozycjonowanie lokalne zwiększa widoczność Twojej firmy w wynikach Google Maps oraz w lokalnych wynikach wyszukiwania Google.
                  </p>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 h-full">
                  <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Klienci z okolicy</h3>
                  <p className="text-premium-light/70">
                    Przyciąga klientów z Twojej okolicy, którzy szukają produktów lub usług, które oferujesz. To zwiększa ruch i konwersję.
                  </p>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.3}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 h-full">
                  <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Zaufanie lokalnej społeczności</h3>
                  <p className="text-premium-light/70">
                    Buduje zaufanie w lokalnej społeczności poprzez pozytywne recenzje i wysoką pozycję w wynikach wyszukiwania.
                  </p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>
        
        {/* For whom is it */}
        <section className="py-24 bg-premium-dark relative">
          <div className="container mx-auto px-4">
            <FadeInSection>
              <h2 className="text-center text-3xl sm:text-4xl font-bold mb-6">
                Dla kogo
              </h2>
              <p className="text-center text-premium-light/70 max-w-2xl mx-auto mb-16">
                Pozycjonowanie lokalne jest szczególnie ważne dla firm, które obsługują klientów w określonej lokalizacji.
              </p>
            </FadeInSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FadeInSection delay={0.1}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Store className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Restauracje i kawiarnie</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Building className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sklepy stacjonarne</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.3}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Salony piękności</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.4}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Gabinety medyczne</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.5}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kancelarie prawne</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.6}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Building className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Firmy budowlane</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.7}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Warsztaty samochodowe</h3>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.8}>
                <div className="bg-premium-dark/50 border border-white/10 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <Home className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Siłownie i kluby fitness</h3>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section id="form" className="py-24 bg-premium-dark/90 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <FadeInSection>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
                  Rozpocznij pozycjonowanie lokalne
                </h2>
                <p className="text-premium-light/70 text-center mb-12">
                  Wypełnij formularz, a nasz specjalista skontaktuje się z Tobą, aby omówić szczegóły Twojego projektu.
                </p>
              </FadeInSection>
              
              <ContactForm />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <CTA />
      </main>

      <Footer />
    </>
  );
};

export default LocalSeo;
