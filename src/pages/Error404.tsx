
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import PageDotAnimation from "@/components/PageDotAnimation";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/utils/themeContext";

const Error404 = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      <PageDotAnimation />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="neo-blur p-10 rounded-2xl max-w-xl mx-auto">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Strona nie została znaleziona</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className={`border-white/10 ${theme === 'light' ? 'hover:bg-black hover:text-white' : 'hover:bg-white hover:text-black'}`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do poprzedniej strony
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              className="bg-premium-gradient hover:bg-white hover:text-black"
            >
              Strona główna
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Error404;
