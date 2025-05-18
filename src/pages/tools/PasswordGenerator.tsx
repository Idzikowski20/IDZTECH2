
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTheme } from '@/utils/themeContext';
import { Copy, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CTA from '@/components/CTA';

const PasswordGenerator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      toast.error('Wybierz co najmniej jeden typ znaków', {
        position: 'top-center',
      });
      return;
    }

    let result = '';
    const charactersLength = charset.length;
    
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    setPassword(result);
    calculateStrength(result);
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    
    // Length
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    
    // Character variety
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    // Normalize to 0-100
    setPasswordStrength(Math.min(Math.floor((score / 7) * 100), 100));
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success('Hasło skopiowane do schowka!', {
      position: 'top-center',
    });
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Słabe';
    if (passwordStrength < 70) return 'Średnie';
    return 'Silne';
  };

  return (
    <>
      <Helmet>
        <title>Generator Haseł | IDZTECH</title>
        <meta name="description" content="Wygeneruj bezpieczne, silne hasła za pomocą naszego generatora haseł. Dostosuj długość, znaki specjalne i inne parametry." />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Generator Haseł</h1>
            <p className="text-lg mb-10 text-center">
              Stwórz bezpieczne, silne hasło dostosowane do Twoich potrzeb.
            </p>
            
            <div className={`rounded-lg p-8 mb-10 ${
              theme === 'light' 
                ? 'bg-white shadow-lg border border-gray-100' 
                : 'bg-premium-dark/70 border border-white/10'
            }`}>
              <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                <Input
                  value={password}
                  readOnly
                  className="flex-grow text-lg font-mono h-12 bg-gray-50 dark:bg-gray-900"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline"
                    className="h-12"
                  >
                    <Copy className="mr-2 h-5 w-5" /> Kopiuj
                  </Button>
                  <Button 
                    onClick={generatePassword}
                    className="h-12 bg-premium-gradient hover:opacity-90"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" /> Generuj
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span>Siła hasła: {getStrengthText()}</span>
                  <span>{passwordStrength}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                  <div 
                    className={`h-full rounded-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label>Długość hasła: {length}</label>
                  </div>
                  <Slider 
                    value={[length]} 
                    min={4} 
                    max={32} 
                    step={1} 
                    onValueChange={(value) => setLength(value[0])}
                    className="mb-6" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lowercase" 
                      checked={includeLowercase} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setIncludeLowercase(checked)
                      }}
                    />
                    <label htmlFor="lowercase">Małe litery (a-z)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="uppercase" 
                      checked={includeUppercase} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setIncludeUppercase(checked)
                      }}
                    />
                    <label htmlFor="uppercase">Wielkie litery (A-Z)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="numbers" 
                      checked={includeNumbers} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setIncludeNumbers(checked)
                      }}
                    />
                    <label htmlFor="numbers">Cyfry (0-9)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="symbols" 
                      checked={includeSymbols} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setIncludeSymbols(checked)
                      }}
                    />
                    <label htmlFor="symbols">Znaki specjalne (!@#$%^&*)</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg p-6 mt-6 ${
              theme === 'light' 
                ? 'bg-white shadow-md border border-gray-100' 
                : 'bg-premium-dark/40 border border-white/10'
            }`}>
              <h2 className="text-xl font-bold mb-4">Wskazówki dotyczące silnych haseł</h2>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Używaj co najmniej 12-16 znaków</li>
                <li>Łącz duże i małe litery, cyfry oraz znaki specjalne</li>
                <li>Unikaj łatwo zgadywalnych informacji (daty urodzenia, imiona)</li>
                <li>Nie używaj tego samego hasła na różnych stronach</li>
                <li>Rozważ użycie menedżera haseł do ich bezpiecznego przechowywania</li>
              </ul>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      
      <Footer />
    </>
  );
};

export default PasswordGenerator;
