
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-premium-dark flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-premium-dark/50 border border-premium-light/10 rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Odzyskiwanie hasła</h1>
        <p className="text-premium-light/70 text-center mb-6">
          Funkcja odzyskiwania hasła jest obecnie wyłączona. Zostanie zaimplementowana z integracją Sanity.io.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="w-full bg-premium-gradient hover:bg-premium-purple hover:text-white"
        >
          Powrót do strony głównej
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
