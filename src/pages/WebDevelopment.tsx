
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Check, ChevronRight, Monitor, Code, LineChart, Zap, Users, Globe, Lock } from "lucide-react";
import ProcessAnimation from "@/components/ProcessAnimation";
import BlinkingUnderscore from "@/components/BlinkingUnderscore";

const WebDevelopment = () => {
  return <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-32 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[120px] -z-10 fixed"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[120px] -z-10 fixed"></div>
        
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList className="text-premium-light/60">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/services">Usługi</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-premium-light">Tworzenie stron internetowych</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-premium-purple font-medium">Tworzenie Stron Internetowych</span>
              <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                Twoja Wizja, 
                <span className="relative">
                  <span className="absolute -left-1 -right-1 h-1/2 bottom-0 bg-gradient-to-r from-premium-purple/40 to-premium-blue/20 z-0"></span>
                  <span className="relative z-10">Nasze</span>
                </span> 
                {" "}Podejście
                <br />
                IDZ.TECH<BlinkingUnderscore />
              </h1>
              <p className="text-premium-light/70 text-lg mb-8">
                Profesjonalne strony WWW dla Twojego biznesu. Projektujemy i tworzymy nowoczesne, 
                responsywne strony internetowe, które nie tylko świetnie wyglądają, 
                ale również skutecznie realizują cele biznesowe.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-premium-gradient hover:opacity-90 transition-opacity">
                  Darmowa wycena
                </Button>
                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-gray-50">
                  Zobacz realizacje
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/4eaa25a8-fb84-4c19-ae4f-8536407401c1.png" 
                alt="Tworzenie stron WWW - usługi" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Co oferujemy</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Nowoczesne rozwiązania webowe</h2>
            <p className="text-premium-light/70 text-lg">
              Dostarczamy kompleksowe usługi tworzenia stron internetowych dostosowane do potrzeb Twojego biznesu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-purple to-premium-blue flex items-center justify-center mb-4">
                <Monitor className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Strony wizytówkowe</h3>
              <p className="text-premium-light/70 mb-4">
                Profesjonalne strony internetowe prezentujące Twoją firmę i oferowane usługi, idealne dla małych i średnich przedsiębiorstw.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Responsywny design</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Optymalizacja SEO</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Formularz kontaktowy</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-blue to-premium-pink flex items-center justify-center mb-4">
                <Code className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sklepy internetowe</h3>
              <p className="text-premium-light/70 mb-4">
                Kompleksowe rozwiązania e-commerce umożliwiające sprzedaż produktów online z intuicyjnym panelem administracyjnym.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Zarządzanie produktami</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Integracja płatności</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">System zamówień</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-pink to-premium-purple flex items-center justify-center mb-4">
                <LineChart className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Portale i aplikacje</h3>
              <p className="text-premium-light/70 mb-4">
                Zaawansowane systemy internetowe z dedykowanymi funkcjonalnościami dostosowanymi do indywidualnych potrzeb.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">System logowania</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">Bazy danych</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">API i integracje</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-premium-dark/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Dlaczego my</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Korzyści współpracy z nami</h2>
            <p className="text-premium-light/70 text-lg">
              Nasza agencja to zespół doświadczonych specjalistów, którzy zadbają o każdy aspekt Twojej obecności w sieci.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 text-center hover:border-white/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-premium-purple to-premium-blue mx-auto flex items-center justify-center mb-4">
                <Zap className="text-premium-light" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Szybkość działania</h3>
              <p className="text-premium-light/70 text-sm">
                Optymalizujemy strony pod kątem szybkości ładowania, co przekłada się na lepsze wrażenia użytkownika.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 text-center hover:border-white/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-premium-blue to-premium-pink mx-auto flex items-center justify-center mb-4">
                <Users className="text-premium-light" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">User Experience</h3>
              <p className="text-premium-light/70 text-sm">
                Projektujemy strony z myślą o użytkownikach, zapewniając intuicyjną nawigację i przejrzysty interfejs.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 text-center hover:border-white/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-premium-pink to-premium-purple mx-auto flex items-center justify-center mb-4">
                <Globe className="text-premium-light" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">SEO-friendly</h3>
              <p className="text-premium-light/70 text-sm">
                Nasze strony są zoptymalizowane pod kątem wyszukiwarek, co zwiększa ich widoczność w Google.
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-gray-300 rounded-xl p-6 text-center hover:border-white/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-premium-purple to-premium-blue mx-auto flex items-center justify-center mb-4">
                <Lock className="text-premium-light" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Bezpieczeństwo</h3>
              <p className="text-premium-light/70 text-sm">
                Dbamy o odpowiednie zabezpieczenia i regularne aktualizacje, chroniąc dane Twoje i Twoich klientów.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-purple font-medium">Jak działamy</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Proces tworzenia strony</h2>
            <p className="text-premium-light/70 text-lg">
              Nasz sprawdzony proces zapewnia najwyższą jakość i terminowość realizacji projektów.
            </p>
          </div>
          
          <ProcessAnimation imageSrc="/lovable-uploads/b149e3ae-a413-4c99-bb58-3cf1dd7c8f2b.png" />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-premium-dark/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Gotowy na profesjonalną stronę dla swojego biznesu?</h2>
            <p className="text-premium-light/70 text-lg mb-8">
              Skontaktuj się z nami i umów się na bezpłatną konsultację. Omówimy Twoje potrzeby i zaproponujemy optymalne rozwiązanie.
            </p>
            <Button size="lg" className="bg-premium-gradient hover:opacity-90 transition-opacity">
              Skontaktuj się z nami
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default WebDevelopment;
