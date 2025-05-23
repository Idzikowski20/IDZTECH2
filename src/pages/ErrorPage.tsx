
import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageDotAnimation from "@/components/PageDotAnimation";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}

const ErrorPage = ({ code = 500, title = "Wystąpił błąd", message = "Przepraszamy, wystąpił nieoczekiwany błąd." }: ErrorPageProps) => {
  const navigate = useNavigate();
  const error = useRouteError();
  
  // Use error information from React Router if available
  const errorMessage = error ? 
    (error instanceof Error ? error.message : JSON.stringify(error)) : 
    message;

  return (
    <div className="min-h-screen bg-premium-dark flex flex-col">
      <Navbar />
      <PageDotAnimation />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="neo-blur p-10 rounded-2xl max-w-xl mx-auto">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4">{code}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">{title}</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            {errorMessage}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="border-white/10 hover:bg-white hover:text-black"
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

export default ErrorPage;
