
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Calendar, Clock, Send } from 'lucide-react';

const ContactPage = () => {
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
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Umów bezpłatną konsultację</h1>
            <p className="text-xl text-premium-light/70">
              Skontaktuj się z nami i omów swoje potrzeby biznesowe. Nasi eksperci są gotowi pomóc Ci osiągnąć Twoje cele marketingowe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Wypełnij formularz</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Imię i nazwisko*</label>
                      <Input
                        id="name"
                        placeholder="Jan Kowalski"
                        className="bg-premium-dark/40 border-white/10 focus:border-premium-purple focus-visible:ring-premium-purple/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">Nazwa firmy*</label>
                      <Input
                        id="company"
                        placeholder="Nazwa firmy"
                        className="bg-premium-dark/40 border-white/10 focus:border-premium-purple focus-visible:ring-premium-purple/20"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email*</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jan@example.com"
                        className="bg-premium-dark/40 border-white/10 focus:border-premium-purple focus-visible:ring-premium-purple/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Telefon*</label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+48 123 456 789"
                        className="bg-premium-dark/40 border-white/10 focus:border-premium-purple focus-visible:ring-premium-purple/20"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">Usługa, którą jesteś zainteresowany</label>
                    <select
                      id="service"
                      className="w-full bg-premium-dark/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-premium-purple focus:ring-1 focus:ring-premium-purple/20"
                    >
                      <option value="">Wybierz usługę</option>
                      <option value="web-dev">Tworzenie stron www</option>
                      <option value="ecommerce">Tworzenie sklepów internetowych</option>
                      <option value="seo">Pozycjonowanie stron internetowych</option>
                      <option value="local-seo">Pozycjonowanie lokalne</option>
                      <option value="google-ads">Kampanie Google Ads</option>
                      <option value="meta-ads">Kampanie Meta Ads</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Wiadomość</label>
                    <Textarea
                      id="message"
                      placeholder="Opisz swoje potrzeby..."
                      rows={5}
                      className="bg-premium-dark/40 border-white/10 focus:border-premium-purple focus-visible:ring-premium-purple/20 resize-none"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-premium-gradient hover:opacity-90 transition-opacity">
                    <Send size={16} className="mr-2" />
                    Wyślij wiadomość
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Contact Details */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8 h-full">
                <h3 className="text-2xl font-semibold mb-6">Informacje o spotkaniu</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Czas trwania</h4>
                      <p className="text-premium-light/70">30-45 minut</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center mr-4">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Termin spotkania</h4>
                      <p className="text-premium-light/70">Skontaktujemy się w ciągu 24h, aby ustalić dogodny termin</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-8">
                    <h4 className="font-medium text-lg">Co zyskujesz?</h4>
                    
                    <div className="flex items-start space-x-3">
                      <Check size={18} className="text-premium-purple mt-1 flex-shrink-0" />
                      <p className="text-premium-light/70">Indywidualne podejście i strategię dopasowaną do Twoich potrzeb</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Check size={18} className="text-premium-purple mt-1 flex-shrink-0" />
                      <p className="text-premium-light/70">Propozycję rozwiązań opartą na analizie Twojego biznesu</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Check size={18} className="text-premium-purple mt-1 flex-shrink-0" />
                      <p className="text-premium-light/70">Wstępną wycenę projektu bez żadnych zobowiązań</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Check size={18} className="text-premium-purple mt-1 flex-shrink-0" />
                      <p className="text-premium-light/70">Porady ekspertów z wieloletnim doświadczeniem</p>
                    </div>
                  </div>
                  
                  <div className="bg-premium-purple/10 rounded-lg p-4 border border-premium-purple/30 mt-6">
                    <p className="text-center text-sm">
                      Konsultacja jest całkowicie bezpłatna i niezobowiązująca.
                      <br />Skorzystaj z wiedzy naszych ekspertów!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
