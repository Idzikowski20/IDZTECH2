import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Calendar, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
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
                <ContactForm />
              </div>
            </div>
            
            {/* Contact Details */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-premium-dark/60 border border-white/10 rounded-xl p-8 h-full">
                <h3 className="text-2xl font-semibold mb-6">Informacje o spotkaniu</h3>
                
                <div className="space-y-6">
                  {/* Removed the image here */}
                  
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
