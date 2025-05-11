import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';

const WebDevelopment = () => {
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <ServiceBreadcrumb currentPage="Tworzenie stron WWW" currentPath="/tworzenie-stron-www" />
      
      {/* Hero Section */}
      <section className="pt-20 pb-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Profesjonalne <span className="bg-premium-gradient text-transparent bg-clip-text">strony internetowe</span> dla Twojego biznesu
              </h1>
              <p className="text-xl text-premium-light/70">
                Tworzymy nowoczesne, responsywne i szybkie strony internetowe, które przyciągają klientów i zwiększają konwersję.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-premium-purple" size={20} />
                  <span>Przyjazne dla wyszukiwarek (SEO)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-premium-purple" size={20} />
                  <span>Dopasowane do urządzeń mobilnych</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-premium-purple" size={20} />
                  <span>Intuicyjny panel zarządzania treścią</span>
                </div>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white">
                    Zamów bezpłatną wycenę
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-premium-purple/50 text-premium-light hover:bg-premium-purple/10">
                  <Phone size={16} className="mr-2" />
                  Zadzwoń do nas
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-0.5 bg-premium-gradient rounded-xl blur-sm opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Projektowanie stron internetowych"
                className="w-full h-auto rounded-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Nasza oferta</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              Co możemy dla Ciebie zrobić?
            </h2>
            <p className="text-xl text-premium-light/70">
              Oferujemy kompleksowe usługi związane z tworzeniem stron internetowych, od projektu po wdrożenie i optymalizację.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Projektowanie stron internetowych</h3>
              <p className="text-premium-light/70 mb-4">
                Tworzymy unikalne projekty graficzne, które odzwierciedlają charakter Twojej marki i przyciągają uwagę klientów.
              </p>
              <Link to="/kontakt">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
            
            {/* Service Card 2 */}
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Tworzenie stron responsywnych</h3>
              <p className="text-premium-light/70 mb-4">
                Zapewniamy, że Twoja strona będzie wyglądać i działać doskonale na każdym urządzeniu, od smartfonów po komputery.
              </p>
              <Link to="/kontakt">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
            
            {/* Service Card 3 */}
            <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Optymalizacja SEO</h3>
              <p className="text-premium-light/70 mb-4">
                Dbamy o to, aby Twoja strona była widoczna w wynikach wyszukiwania Google, co przekłada się na większy ruch i więcej klientów.
              </p>
              <Link to="/kontakt">
                <Button variant="secondary" className="w-full">
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technology Stack Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Technologie</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">
              W czym tworzymy strony internetowe?
            </h2>
            <p className="text-xl text-premium-light/70">
              Korzystamy z najnowszych technologii, aby zapewnić Ci szybką, bezpieczną i funkcjonalną stronę internetową.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
            {/* Technology Logos */}
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
                alt="JavaScript"
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">JavaScript</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
                alt="CSS3"
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">CSS3</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/HTML5_logo.svg/800px-HTML5_logo.svg.png"
                alt="HTML5"
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">HTML5</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
                alt="TypeScript"
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">TypeScript</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                alt="React"
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">React</p>
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/17/Yarn_Logo.svg"
                alt="Yarn"
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-sm text-premium-light/70 mt-2 text-center">Yarn</p>
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
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-premium-purple font-medium">Zacznijmy!</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-3 mb-6">
              Stwórzmy razem Twoją nową stronę internetową
            </h2>
            <p className="text-premium-light/70 text-lg mb-8 max-w-2xl mx-auto">
              Skontaktuj się z nami już dziś, aby omówić szczegóły Twojego projektu i otrzymać bezpłatną wycenę.
            </p>
            <Link to="/contact">
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                Darmowa konsultacja
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebDevelopment;
