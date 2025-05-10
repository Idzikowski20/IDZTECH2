
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Users, MessageCircle, Smartphone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetaAdsCampaigns = () => {
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
              <span className="text-premium-purple font-medium">Meta Ads</span>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-3 mb-6">
                Kampanie reklamowe na <span className="bg-premium-gradient text-transparent bg-clip-text">Facebooku i Instagramie</span>
              </h1>
              
              <p className="text-xl text-premium-light/80 mb-8">
                Wykorzystaj potencjał mediów społecznościowych Meta do budowania świadomości marki i generowania leadów. Dotrzyj do precyzyjnie określonych grup docelowych dzięki zaawansowanym narzędziom targetowania.
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
                  <span className="text-sm text-premium-light/70">Certyfikowany Partner Meta</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Precyzyjne targetowanie</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-premium-purple" />
                  <span className="text-sm text-premium-light/70">Angażujące formaty reklamowe</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
                <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                    alt="Meta Ads Campaign" 
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
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Rodzaje kampanii Meta Ads</h2>
            <p className="text-premium-light/70 text-lg">
              Oferujemy kompleksowe usługi w zakresie reklamy w mediach społecznościowych Meta, dopasowane do Twoich celów biznesowych:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie świadomościowe</h3>
              <p className="text-premium-light/70">
                Buduj rozpoznawalność marki i zwiększaj zasięg wśród potencjalnych klientów dopasowanych do Twojego targetu.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie konwersyjne</h3>
              <p className="text-premium-light/70">
                Generuj leady i zwiększaj sprzedaż poprzez kierowanie ruchu na Twoją stronę lub do sklepu internetowego.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <BarChart size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Remarketing</h3>
              <p className="text-premium-light/70">
                Docieraj ponownie do użytkowników, którzy już wchodzili w interakcję z Twoją marką, zwiększając szanse na konwersję.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie Messenger</h3>
              <p className="text-premium-light/70">
                Wykorzystaj chatboty i komunikację bezpośrednią do angażowania klientów i automatyzacji procesu obsługi.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Smartphone size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie Instagram</h3>
              <p className="text-premium-light/70">
                Wykorzystaj potencjał wizualnej platformy Instagram do budowania zaangażowania i prezentacji produktów.
              </p>
            </div>
            
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 transition-transform hover:-translate-y-2 duration-300 animate-fade-in" style={{ animationDelay: '1.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-premium-gradient flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kampanie wideo</h3>
              <p className="text-premium-light/70">
                Twórz angażujące materiały wideo, które przyciągają uwagę użytkowników i budują emocjonalną więź z marką.
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
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Jak prowadzimy kampanie Meta Ads</h2>
            <p className="text-premium-light/70 text-lg">
              Oferujemy kompleksowe podejście do prowadzenia kampanii reklamowych w mediach społecznościowych Meta, które gwarantuje osiągnięcie najlepszych wyników.
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Badanie i strategia",
                description: "Analizujemy Twoją branżę, konkurencję i określamy grupę docelową, aby stworzyć skuteczną strategię reklamową.",
                delay: "0.6s"
              },
              {
                step: "02",
                title: "Tworzenie kreatywnych treści",
                description: "Projektujemy angażujące kreacje reklamowe, które przyciągają uwagę i zachęcają do działania.",
                delay: "0.7s"
              },
              {
                step: "03",
                title: "Precyzyjne targetowanie",
                description: "Wykorzystujemy zaawansowane opcje targetowania Meta, aby dotrzeć do najbardziej wartościowych odbiorców.",
                delay: "0.8s"
              },
              {
                step: "04",
                title: "Optymalizacja i raportowanie",
                description: "Nieustannie analizujemy wyniki kampanii i wprowadzamy optymalizacje, aby maksymalizować ROI.",
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
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Dlaczego warto inwestować w Meta Ads?</h2>
            <p className="text-premium-light/70 text-lg">
              Kampanie w mediach społecznościowych Meta to skuteczny sposób na rozwój biznesu, który przynosi wymierne korzyści:
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8">
              <div className="space-y-6">
                {[
                  "Ogromny zasięg - możliwość dotarcia do ponad 3 miliardów użytkowników platformy Meta",
                  "Zaawansowane targetowanie - precyzyjne definiowanie grupy odbiorców",
                  "Różnorodne formaty reklamowe - teksty, zdjęcia, wideo, karuzele, kolekcje",
                  "Budowanie społeczności wokół marki i długotrwałych relacji z klientami",
                  "Możliwość śledzenia i analizowania wyników kampanii w czasie rzeczywistym",
                  "Niższy koszt pozyskania klienta w porównaniu do tradycyjnych kanałów marketingowych"
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
                  src="https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80" 
                  alt="Meta Ads Benefits" 
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
              Gotowy na skuteczne kampanie w mediach społecznościowych?
            </h2>
            <p className="text-premium-light/70 text-lg mb-8 max-w-2xl mx-auto">
              Skontaktuj się z nami już dziś i dowiedz się, jak nasze kampanie Meta Ads mogą pomóc Twojej firmie zwiększyć rozpoznawalność marki i pozyskać nowych klientów.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                  Darmowa konsultacja
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10 rounded-full px-8 py-6 text-slate-50 bg-black/0">
                  Zobacz nasze realizacje
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

export default MetaAdsCampaigns;
