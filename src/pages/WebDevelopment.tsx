import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ServiceBreadcrumb from "@/components/ServiceBreadcrumb";

const WebDevelopment = () => {
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
          <ServiceBreadcrumb
            currentPage="Tworzenie stron www"
            currentPath="/tworzenie-stron-www"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-premium-blue font-medium">Web Development</span>
              <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">Tworzenie stron internetowych</h1>
              <p className="text-premium-light/70 text-lg mb-8">
                Projektujemy i tworzymy nowoczesne, responsywne strony internetowe, 
                które budują profesjonalny wizerunek Twojej firmy i przyciągają klientów.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-premium-gradient hover:opacity-90 transition-opacity"
                >
                  Darmowa wycena
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/10 hover:bg-white/5"
                >
                  Zobacz portfolio
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="w-full h-auto overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/ffa2511a-2a5c-47e5-958c-832bbe445f52.png" 
                  alt="Tworzenie stron internetowych" 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebDevelopment;
