
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import PageDotAnimation from '@/components/PageDotAnimation';
import { useNavigate } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VerticalProcessSteps from '@/components/VerticalProcessSteps';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';

const WebDevelopment = () => {
  const navigate = useNavigate();

  const features = [
    "Projektowanie responsywnych stron internetowych",
    "Optymalizacja szybkości ładowania strony",
    "Intuicyjny interfejs użytkownika",
    "Integracja z mediami społecznościowymi",
    "Konfiguracja Google Analytics",
    "Systemy zarządzania treścią (CMS)",
    "Formularze kontaktowe i mapy",
    "Projektowanie UX/UI",
    "SEO on-page",
    "Pomoc techniczna po wdrożeniu"
  ];

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <PageDotAnimation />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ServiceBreadcrumb 
                items={[
                  { label: 'Strona główna', href: '/' },
                  { label: 'Usługi', href: '#services' },
                  { label: 'Tworzenie stron internetowych', href: '/tworzenie-stron-www' }
                ]} 
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-8 mb-6">
                Tworzenie stron <span className="text-transparent bg-clip-text bg-premium-gradient">internetowych</span>
              </h1>
              <p className="text-xl text-premium-light/70 mb-8 max-w-2xl">
                Tworzymy nowoczesne, responsywne i zoptymalizowane strony internetowe, które 
                pomagają osiągać cele biznesowe i wyróżniać się na tle konkurencji.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/kontakt')} 
                  className="px-8 py-6 bg-premium-gradient"
                  size="lg"
                >
                  Zamów bezpłatną wycenę
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-6"
                  size="lg"
                  onClick={() => navigate('/portfolio')}
                >
                  Zobacz portfolio
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <img 
                src="/lovable-uploads/4eaa25a8-fb84-4c19-ae4f-8536407401c1.png" 
                alt="Tworzenie stron internetowych" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 bg-premium-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-premium-purple font-medium mb-3">Co oferujemy</p>
            <h2 className="text-3xl md:text-4xl font-bold">Tworzenie stron internetowych</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70">
              Oferujemy kompleksowe usługi tworzenia stron internetowych, które są nie tylko 
              atrakcyjne wizualnie, ale również funkcjonalne i zoptymalizowane.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-premium-dark/60 border border-premium-light/10 rounded-xl p-8 hover:transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Strony WWW</h3>
              <p className="text-premium-light/70 mb-4">
                Profesjonalne strony internetowe, które wyróżnią Twoją firmę w sieci i zwiększą konwersję.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Nowoczesny design</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Responsywność na wszystkich urządzeniach</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Przyjazne dla SEO</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-premium-dark/60 border border-premium-light/10 rounded-xl p-8 hover:transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Strony firmowe</h3>
              <p className="text-premium-light/70 mb-4">
                Profesjonalna wizytówka Twojej firmy w internecie z możliwością łatwej edycji treści.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Profesjonalna prezentacja oferty</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Łatwy system zarządzania treścią</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Formularze kontaktowe i mapy</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-premium-dark/60 border border-premium-light/10 rounded-xl p-8 hover:transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full bg-premium-gradient flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Landing pages</h3>
              <p className="text-premium-light/70 mb-4">
                Skuteczne strony docelowe, zoptymalizowane pod kątem konwersji i generowania leadów.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Przekonująca struktura sprzedażowa</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>Efektywne elementy call-to-action</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-premium-purple mr-2 mt-1" />
                  <span>A/B testing dla zwiększenia konwersji</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-gradient-to-b from-premium-dark to-premium-dark/90">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologie</h2>
            <p className="text-xl text-premium-light/70 max-w-3xl mx-auto">
              W czym tworzymy strony internetowe?
            </p>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70">
              Korzystamy z najnowszych technologii, aby zapewnić Ci szybką, bezpieczną i funkcjonalną stronę internetową.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center">
              <img src="/lovable-uploads/2855aef6-a485-402b-b8c8-82af77fb041b.png" alt="JavaScript" className="w-16 h-16 mb-3" />
              <p className="font-medium">JavaScript</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/lovable-uploads/af7b17cd-510f-468f-a8b1-5b0c5be88c9f.png" alt="CSS3" className="w-16 h-16 mb-3" />
              <p className="font-medium">CSS3</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/lovable-uploads/3f93b345-6750-4cdb-8e53-e7b4e8fdf0e9.png" alt="HTML5" className="w-16 h-16 mb-3" />
              <p className="font-medium">HTML5</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/lovable-uploads/0a84b382-c65c-4f3a-bfdc-56f91938ef33.png" alt="TypeScript" className="w-16 h-16 mb-3" />
              <p className="font-medium">TypeScript</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/lovable-uploads/0487901d-bc96-4d6d-8847-1c5926dd899e.png" alt="React" className="w-16 h-16 mb-3" />
              <p className="font-medium">React</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-premium-purple font-medium mb-3">Proces tworzenia</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kroki do stworzenia strony internetowej</h2>
            <p className="text-lg max-w-3xl mx-auto text-premium-light/70">
              Poznaj etapy tworzenia skutecznej strony internetowej, która będzie wspierać Twój biznes.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <VerticalProcessSteps />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-premium-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-premium-purple font-medium mb-3">Co otrzymasz</p>
            <h2 className="text-3xl md:text-4xl font-bold">Funkcjonalności stron internetowych</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="w-6 h-6 rounded-full bg-premium-gradient flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
                <p className="text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-premium-purple font-medium mb-3">Plan działania</p>
            <h2 className="text-3xl md:text-4xl font-bold">Agenda</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-premium-light/70">
              Poznaj szczegółowy plan działania, który realizujemy dla każdego projektu strony internetowej.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>1. Analiza i strategia</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Określenie celów biznesowych strony</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Analiza konkurencji i rynku</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Określenie grupy docelowej</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Strategia pozycjonowania</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>2. Projektowanie UX/UI</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Wireframing i prototypowanie</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Projektowanie interfejsu użytkownika</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja ścieżek użytkownika</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Design responsywny</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>3. Implementacja i rozwój</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Kodowanie frontendu i backendu</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Implementacja CMS</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja wydajności</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Testowanie funkcjonalności</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>4. SEO i treści</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja on-page SEO</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Tworzenie treści zorientowanych na konwersję</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Optymalizacja meta tagów</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Analiza słów kluczowych</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>5. Wdrożenie i testy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Konfiguracja serwera i domeny</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Testowanie użyteczności</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Testowanie na różnych urządzeniach</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Audyt przed publikacją</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-premium-dark/60 border-premium-light/10">
              <CardHeader>
                <CardTitle>6. Wsparcie i rozwój</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Regularne aktualizacje</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Monitorowanie wydajności</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Analityka i raportowanie</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="text-premium-purple mr-2 mt-1" />
                    <span>Ciągłe doskonalenie</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-premium-dark/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Gotowy na profesjonalną stronę internetową?</h2>
          <p className="text-xl text-premium-light/70 mb-8 max-w-3xl mx-auto">
            Skontaktuj się z nami już dziś i rozpocznijmy pracę nad Twoją nową stroną,
            która będzie przyciągać klientów i zwiększać sprzedaż.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/kontakt')} 
              className="px-8 py-6 bg-premium-gradient"
              size="lg"
            >
              Skontaktuj się z nami
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-6"
              size="lg"
              onClick={() => navigate('/portfolio')}
            >
              Zobacz nasze realizacje
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebDevelopment;
