
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Check, ChevronRight, ShoppingCart, CreditCard, Truck, Package, BarChart, Shield, Share2, Search } from "lucide-react";

const ECommerce = () => {
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-32 right-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-pink/20 rounded-full blur-[120px] -z-10"></div>
        
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
                <BreadcrumbLink className="text-premium-light">Tworzenie sklepów internetowych</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-premium-blue font-medium">E-commerce</span>
              <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">Tworzenie sklepów internetowych</h1>
              <p className="text-premium-light/70 text-lg mb-8">
                Projektujemy i wdrażamy profesjonalne sklepy internetowe, które zwiększają sprzedaż 
                i zapewniają doskonałe doświadczenia zakupowe dla Twoich klientów.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-premium-gradient hover:opacity-90 transition-opacity group relative overflow-hidden"
                >
                  <span className="relative z-10">Darmowa wycena</span>
                  <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/10 hover:bg-white/5 text-gray-50 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Zobacz realizacje</span>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="relative z-10">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
                  <div className="w-full aspect-video relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-tr from-premium-blue to-premium-pink opacity-10"></div>
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Sklep internetowy" className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="E-commerce" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="E-commerce" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="E-commerce" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-premium-blue/20 rounded-full blur-[80px] -z-10 transform translate-x-10 translate-y-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-blue font-medium">Funkcjonalności</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Kompleksowe rozwiązania e-commerce</h2>
            <p className="text-premium-light/70 text-lg">
              Nasze sklepy internetowe są wyposażone w najnowocześniejsze funkcje, które ułatwiają zarządzanie i zwiększają sprzedaż.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-blue to-premium-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intuicyjny panel administracyjny</h3>
              <p className="text-premium-light/70 mb-4">
                Łatwe zarządzanie produktami, kategoriami, zamówieniami i klientami dzięki przyjaznemu interfejsowi.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Masowe zarządzanie produktami</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Automatyczne powiadomienia</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Raporty sprzedaży</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-pink to-premium-purple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integracje płatności</h3>
              <p className="text-premium-light/70 mb-4">
                Pełna integracja z najpopularniejszymi bramkami płatności, zapewniająca bezpieczeństwo transakcji.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">Przelewy24</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">PayPal</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">Karty kredytowe/debetowe</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-purple to-premium-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Opcje dostawy</h3>
              <p className="text-premium-light/70 mb-4">
                Integracja z popularnymi firmami kurierskimi i innymi opcjami wysyłki dla wygody klientów.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">InPost Paczkomaty</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">DPD, DHL, UPS</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Poczta Polska</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-blue to-premium-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Package className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Zarządzanie magazynem</h3>
              <p className="text-premium-light/70 mb-4">
                Automatyczne śledzenie stanów magazynowych, alerty niskiego stanu i integracja z dostawcami.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Automatyczne aktualizacje</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Śledzenie przesyłek</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-blue mr-2" />
                  <span className="text-premium-light/70 text-sm">Wielomagazynowość</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-pink to-premium-purple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analityka i raporty</h3>
              <p className="text-premium-light/70 mb-4">
                Szczegółowe dane o sprzedaży, zachowaniach klientów i efektywności kampanii marketingowych.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">Google Analytics</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">Raporty sprzedażowe</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-pink mr-2" />
                  <span className="text-premium-light/70 text-sm">Śledzenie konwersji</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-premium-purple to-premium-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-premium-light" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bezpieczeństwo</h3>
              <p className="text-premium-light/70 mb-4">
                Najwyższe standardy bezpieczeństwa, certyfikaty SSL i regularne aktualizacje zabezpieczeń.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Certyfikat SSL</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Zgodność z RODO</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-premium-purple mr-2" />
                  <span className="text-premium-light/70 text-sm">Backup danych</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Platforms Section */}
      <section className="py-16 bg-premium-dark/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-blue font-medium">Platformy</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Platformy e-commerce, które wdrażamy</h2>
            <p className="text-premium-light/70 text-lg">
              Dobieramy najlepsze rozwiązania w zależności od potrzeb, skali biznesu i specyfiki branży.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Platform 1 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-premium-blue/30 transition-colors text-center group">
              <div className="h-20 flex items-center justify-center mb-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/WooCommerce_logo.svg/2560px-WooCommerce_logo.svg.png" 
                  alt="WooCommerce" 
                  className="h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">WooCommerce</h3>
              <p className="text-premium-light/70 mb-4">
                Idealne rozwiązanie dla małych i średnich sklepów, zbudowane na platformie WordPress.
              </p>
              <span className="text-premium-blue font-medium">Idealny dla małych i średnich sklepów</span>
            </div>
            
            {/* Platform 2 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-premium-purple/30 transition-colors text-center transform scale-105 relative group">
              <div className="absolute -top-4 -right-4">
                <span className="bg-premium-gradient text-xs font-medium px-3 py-1 rounded-full">Polecane</span>
              </div>
              <div className="h-20 flex items-center justify-center mb-6">
                <img 
                  src="https://cdn.shopify.com/static/press-center/brand/logo/full-shopify-logo-monotone-screen.svg" 
                  alt="Shopify" 
                  className="h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Shopify</h3>
              <p className="text-premium-light/70 mb-4">
                Kompleksowa platforma e-commerce z zaawansowanymi funkcjami sprzedażowymi i marketingowymi.
              </p>
              <span className="text-premium-purple font-medium">Idealny dla firm szukających szybkiego wdrożenia</span>
            </div>
            
            {/* Platform 3 */}
            <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-premium-pink/30 transition-colors text-center group">
              <div className="h-20 flex items-center justify-center mb-6">
                <img 
                  src="https://magento.com/static-assets/magento-logo.svg" 
                  alt="Magento" 
                  className="h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Magento</h3>
              <p className="text-premium-light/70 mb-4">
                Zaawansowana platforma dla dużych sklepów z rozbudowanymi funkcjonalnościami i skalowalnością.
              </p>
              <span className="text-premium-pink font-medium">Idealny dla dużych projektów e-commerce</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-premium-blue font-medium">Jak działamy</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6">Proces tworzenia sklepu internetowego</h2>
            <p className="text-premium-light/70 text-lg">
              Nasze podejście zapewnia stworzenie sklepu, który będzie spełniał wszystkie wymagania biznesowe i techniczne.
            </p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="text-xl font-semibold ml-4">Analiza i planowanie</h3>
                  </div>
                  <p className="text-premium-light/70">
                    Analizujemy potrzeby Twojego biznesu, badamy konkurencję i planujemy strategię rozwoju sklepu.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Określenie celów biznesowych i grupy docelowej</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Analiza konkurencji i rynku</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Wybór odpowiedniej platformy e-commerce</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="text-xl font-semibold ml-4">UX/UI Design</h3>
                  </div>
                  <p className="text-premium-light/70">
                    Projektujemy interfejs użytkownika, zapewniając łatwość nawigacji i przyjemne doświadczenia zakupowe.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Projektowanie struktury sklepu i ścieżki zakupowej</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Tworzenie makiet i prototypów interfejsu</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Projektowanie responsywnego interfejsu dla wszystkich urządzeń</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="text-xl font-semibold ml-4">Rozwój i wdrożenie</h3>
                  </div>
                  <p className="text-premium-light/70">
                    Implementacja funkcjonalności, integracja z systemami płatności i dostawcami, konfiguracja sklepu.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Programowanie frontend i backend sklepu</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Integracja bramek płatności, firm kurierskich i innych usług</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Konfiguracja systemu zarządzania produktami i zamówieniami</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">4</div>
                    <h3 className="text-xl font-semibold ml-4">Testy i optymalizacja</h3>
                  </div>
                  <p className="text-premium-light/70">
                    Przeprowadzamy testy funkcjonalne, wydajnościowe i optymalizujemy sklep pod kątem SEO.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Testowanie funkcjonalności i procesów zakupowych</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Optymalizacja szybkości ładowania i wydajności sklepu</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Optymalizacja SEO dla lepszej widoczności w wyszukiwarkach</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">5</div>
                    <h3 className="text-xl font-semibold ml-4">Launch i wsparcie</h3>
                  </div>
                  <p className="text-premium-light/70">
                    Uruchamiamy sklep, szkolimy z obsługi i zapewniamy wsparcie techniczne po wdrożeniu.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Uruchomienie sklepu i przekazanie do użytkowania</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Szkolenie z obsługi panelu administracyjnego</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-premium-blue mt-1 mr-3 flex-shrink-0" size={18} />
                      <p className="text-premium-light/70">Ciągłe wsparcie techniczne i rozwój sklepu</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-premium-dark/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-purple/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-blue/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">Gotowy na zwiększenie sprzedaży online?</h2>
            <p className="text-premium-light/70 text-lg mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
              Skontaktuj się z nami i umów się na bezpłatną konsultację. Omówimy Twoje potrzeby i zaproponujemy optymalne rozwiązanie.
            </p>
            <Button 
              size="lg" 
              className="bg-premium-gradient hover:opacity-90 transition-opacity animate-fade-in group relative overflow-hidden"
              style={{animationDelay: "0.4s"}}
            >
              <span className="relative z-10">Skontaktuj się z nami</span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ECommerce;
