
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/utils/themeContext';
import { Search, Copy, Globe, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CTA from '@/components/CTA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DomainNameCreator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [keywords, setKeywords] = useState('');
  const [industry, setIndustry] = useState('');
  const [includeTld, setIncludeTld] = useState(['com', 'pl']);
  const [generatedDomains, setGeneratedDomains] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const industries = [
    { value: 'tech', label: 'Technologia' },
    { value: 'health', label: 'Zdrowie' },
    { value: 'finance', label: 'Finanse' },
    { value: 'education', label: 'Edukacja' },
    { value: 'food', label: 'Gastronomia' },
    { value: 'fashion', label: 'Moda' },
    { value: 'travel', label: 'Podróże' },
    { value: 'sport', label: 'Sport' },
    { value: 'art', label: 'Sztuka i Kultura' },
    { value: 'beauty', label: 'Uroda' },
    { value: 'realestate', label: 'Nieruchomości' },
    { value: 'automotive', label: 'Motoryzacja' }
  ];

  const tlds = ['com', 'pl', 'eu', 'net', 'org', 'info', 'shop', 'online', 'tech', 'app'];

  const prefixes = {
    tech: ['tech', 'digital', 'smart', 'cyber', 'web', 'net', 'app'],
    health: ['health', 'med', 'care', 'vita', 'well', 'cure', 'bio'],
    finance: ['fin', 'money', 'cash', 'bank', 'wealth', 'invest', 'trade'],
    education: ['edu', 'learn', 'academy', 'school', 'tutor', 'study', 'wisdom'],
    food: ['food', 'taste', 'meal', 'cook', 'chef', 'delicious', 'kitchen'],
    fashion: ['style', 'trend', 'chic', 'fashion', 'wear', 'dress', 'glam'],
    travel: ['travel', 'trip', 'voyage', 'tour', 'journey', 'explore', 'wander'],
    sport: ['sport', 'fit', 'active', 'play', 'team', 'athletic', 'win'],
    art: ['art', 'design', 'create', 'studio', 'gallery', 'craft', 'vision'],
    beauty: ['beauty', 'glow', 'style', 'shine', 'pretty', 'cosmetic', 'glamour'],
    realestate: ['home', 'property', 'estate', 'house', 'realty', 'place', 'land'],
    automotive: ['auto', 'car', 'drive', 'motor', 'wheel', 'ride', 'vehicle']
  };

  const suffixes = ['hub', 'spot', 'zone', 'place', 'base', 'center', 'space', 'pro', 'expert', 'group', 'team', 'labs'];

  const generateDomainNames = () => {
    if (!keywords && !industry) {
      toast.error('Wprowadź słowa kluczowe lub wybierz branżę', {
        position: 'top-center',
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Symulacja opóźnienia jak przy prawdziwym generowaniu domen
    setTimeout(() => {
      const keywordList = keywords
        .toLowerCase()
        .split(',')
        .map(k => k.trim())
        .filter(k => k !== '');
      
      const generatedResults: string[] = [];
      const industryPrefixes = industry ? prefixes[industry as keyof typeof prefixes] : [];
      
      // Generowanie z słów kluczowych
      if (keywordList.length > 0) {
        // Kombinacje słów kluczowych
        keywordList.forEach(keyword => {
          // Podstawowe słowo
          includeTld.forEach(tld => {
            generatedResults.push(`${keyword}.${tld}`);
          });
          
          // Z prefiksem z branży
          if (industryPrefixes.length > 0) {
            industryPrefixes.forEach(prefix => {
              includeTld.forEach(tld => {
                generatedResults.push(`${prefix}${keyword}.${tld}`);
                generatedResults.push(`${keyword}${prefix}.${tld}`);
              });
            });
          }
          
          // Z sufiksem
          suffixes.forEach(suffix => {
            includeTld.forEach(tld => {
              generatedResults.push(`${keyword}${suffix}.${tld}`);
            });
          });
        });
        
        // Kombinacje kilku słów kluczowych
        if (keywordList.length > 1) {
          for (let i = 0; i < keywordList.length; i++) {
            for (let j = 0; j < keywordList.length; j++) {
              if (i !== j) {
                includeTld.forEach(tld => {
                  generatedResults.push(`${keywordList[i]}${keywordList[j]}.${tld}`);
                });
              }
            }
          }
        }
      } 
      // Generowanie tylko na podstawie branży
      else if (industry) {
        industryPrefixes.forEach(prefix => {
          suffixes.forEach(suffix => {
            includeTld.forEach(tld => {
              generatedResults.push(`${prefix}${suffix}.${tld}`);
            });
          });
        });
      }
      
      // Dodatkowe kombinacje
      if (industry && keywordList.length > 0) {
        keywordList.forEach(keyword => {
          suffixes.forEach(suffix => {
            includeTld.forEach(tld => {
              const industryName = industry === 'realestate' ? 'estate' : industry;
              generatedResults.push(`${keyword}${industryName}.${tld}`);
              generatedResults.push(`${industryName}${keyword}.${tld}`);
              generatedResults.push(`${keyword}${suffix}.${tld}`);
            });
          });
        });
      }
      
      // Usuwanie duplikatów i limitowanie do 50 wyników
      const uniqueResults = Array.from(new Set(generatedResults)).slice(0, 50);
      
      setGeneratedDomains(uniqueResults);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (domain: string) => {
    navigator.clipboard.writeText(domain);
    toast.success(`Domena "${domain}" skopiowana do schowka!`, {
      position: 'top-center',
    });
  };

  const toggleFavorite = (domain: string) => {
    if (favorites.includes(domain)) {
      setFavorites(favorites.filter(d => d !== domain));
    } else {
      setFavorites([...favorites, domain]);
    }
  };

  const handleTldChange = (tld: string) => {
    if (includeTld.includes(tld)) {
      setIncludeTld(includeTld.filter(t => t !== tld));
    } else {
      setIncludeTld([...includeTld, tld]);
    }
  };

  return (
    <>
      <Helmet>
        <title>Kreator Nazwy Domeny | IDZTECH</title>
        <meta name="description" content="Stwórz idealną nazwę domeny dla swojej strony internetowej lub biznesu za pomocą naszego kreatora nazw domen." />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Kreator Nazwy Domeny</h1>
            <p className="text-lg mb-10 text-center">
              Generuj pomysłowe i dostępne nazwy domen dla swojej strony internetowej lub biznesu.
            </p>
            
            <Card className="mb-10">
              <CardHeader>
                <CardTitle>Podaj szczegóły</CardTitle>
                <CardDescription>Wprowadź słowa kluczowe lub wybierz branżę, aby wygenerować propozycje domen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Słowa kluczowe</label>
                    <Input
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Wprowadź słowa kluczowe oddzielone przecinkami"
                    />
                    <p className="text-sm mt-1 opacity-70">
                      Np. marketing, internet, strony
                    </p>
                  </div>
                  
                  <div>
                    <label className="block mb-2">Branża (opcjonalnie)</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz branżę" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Dowolna</SelectItem>
                        {industries.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block mb-2">Rozszerzenia domen</label>
                  <div className="flex flex-wrap gap-2">
                    {tlds.map(tld => (
                      <Badge 
                        key={tld} 
                        variant={includeTld.includes(tld) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleTldChange(tld)}
                      >
                        .{tld}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={generateDomainNames}
                  className="mt-8 bg-premium-gradient hover:opacity-90"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generowanie...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> Wygeneruj domeny
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            {generatedDomains.length > 0 && (
              <div className={`rounded-lg p-6 mb-10 ${
                theme === 'light' 
                  ? 'bg-white shadow-lg border border-gray-100' 
                  : 'bg-premium-dark/70 border border-white/10'
              }`}>
                <h2 className="text-xl font-bold mb-4">Wygenerowane domeny</h2>
                
                {favorites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" /> Ulubione domeny
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {favorites.map(domain => (
                        <div 
                          key={domain} 
                          className={`flex items-center justify-between p-3 rounded ${
                            theme === 'light'
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-yellow-900/20 border border-yellow-700/30'
                          }`}
                        >
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-yellow-500" />
                            <span>{domain}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => copyToClipboard(domain)}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Kopiuj"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleFavorite(domain)}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Usuń z ulubionych"
                            >
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {generatedDomains
                    .filter(domain => !favorites.includes(domain))
                    .map(domain => (
                      <div 
                        key={domain} 
                        className={`flex items-center justify-between p-3 rounded ${
                          theme === 'light'
                            ? 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50'
                        } transition-colors`}
                      >
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 opacity-70" />
                          <span>{domain}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => copyToClipboard(domain)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Kopiuj"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleFavorite(domain)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Dodaj do ulubionych"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`rounded-lg p-6 ${
              theme === 'light' 
                ? 'bg-white shadow-md border border-gray-100' 
                : 'bg-premium-dark/40 border border-white/10'
            }`}>
              <h2 className="text-xl font-bold mb-4">Wskazówki dotyczące wyboru domeny</h2>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Wybieraj krótkie, łatwe do zapamiętania nazwy domen</li>
                <li>Unikaj myślników i cyfr, które mogą być trudne do przekazania ustnie</li>
                <li>Sprawdź dostępność domeny przed podjęciem decyzji</li>
                <li>Rozważ zakup różnych odmian rozszerzeń (.com, .pl, itd.) dla ochrony marki</li>
                <li>Upewnij się, że nazwa domeny nie narusza znaków towarowych</li>
                <li>Pomyśl o słowach kluczowych związanych z Twoją branżą dla lepszego SEO</li>
              </ul>
              
              <p>
                Po wybraniu idealnej nazwy domeny, możesz ją zarejestrować u rejestratorów domen lub skontaktować się z nami, aby pomóc Ci w całym procesie tworzenia strony.
              </p>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      
      <Footer />
    </>
  );
};

export default DomainNameCreator;
