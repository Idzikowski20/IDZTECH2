
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

  // Translated industry options
  const industries = [
    { value: 'tech', label: t('domainCreator.industries.tech') },
    { value: 'health', label: t('domainCreator.industries.health') },
    { value: 'finance', label: t('domainCreator.industries.finance') },
    { value: 'education', label: t('domainCreator.industries.education') },
    { value: 'food', label: t('domainCreator.industries.food') },
    { value: 'fashion', label: t('domainCreator.industries.fashion') },
    { value: 'travel', label: t('domainCreator.industries.travel') },
    { value: 'sport', label: t('domainCreator.industries.sport') },
    { value: 'art', label: t('domainCreator.industries.art') },
    { value: 'beauty', label: t('domainCreator.industries.beauty') },
    { value: 'realestate', label: t('domainCreator.industries.realestate') },
    { value: 'automotive', label: t('domainCreator.industries.automotive') }
  ];

  const tlds = ['com', 'pl', 'eu', 'net', 'org', 'info', 'shop', 'online', 'tech', 'app'];

  // Extended prefixes and vocabulary for more randomization
  const prefixes = {
    tech: ['tech', 'digital', 'smart', 'cyber', 'web', 'net', 'app', 'pixel', 'byte', 'code', 'dev', 'quantum', 'cloud', 'inno'],
    health: ['health', 'med', 'care', 'vita', 'well', 'cure', 'bio', 'heal', 'life', 'pulse', 'heart', 'fit', 'zen', 'glow'],
    finance: ['fin', 'money', 'cash', 'bank', 'wealth', 'invest', 'trade', 'profit', 'gold', 'funds', 'capital', 'equity', 'asset', 'coin'],
    education: ['edu', 'learn', 'academy', 'school', 'tutor', 'study', 'wisdom', 'skill', 'mentor', 'brain', 'know', 'mind', 'scholar', 'genius'],
    food: ['food', 'taste', 'meal', 'cook', 'chef', 'delicious', 'kitchen', 'flavor', 'spice', 'eat', 'dish', 'feast', 'grill', 'bite'],
    fashion: ['style', 'trend', 'chic', 'fashion', 'wear', 'dress', 'glam', 'vogue', 'luxe', 'design', 'couture', 'model', 'elite', 'look'],
    travel: ['travel', 'trip', 'voyage', 'tour', 'journey', 'explore', 'wander', 'vista', 'global', 'nomad', 'cruise', 'roam', 'quest', 'trek'],
    sport: ['sport', 'fit', 'active', 'play', 'team', 'athletic', 'win', 'trophy', 'champ', 'score', 'game', 'arena', 'coach', 'jump'],
    art: ['art', 'design', 'create', 'studio', 'gallery', 'craft', 'vision', 'brush', 'canvas', 'muse', 'color', 'scope', 'image', 'draw'],
    beauty: ['beauty', 'glow', 'style', 'shine', 'pretty', 'cosmetic', 'glamour', 'radiant', 'charm', 'luxe', 'pure', 'skin', 'aura', 'bloom'],
    realestate: ['home', 'property', 'estate', 'house', 'realty', 'place', 'land', 'nest', 'villa', 'abode', 'condo', 'space', 'build', 'haven'],
    automotive: ['auto', 'car', 'drive', 'motor', 'wheel', 'ride', 'vehicle', 'speed', 'turbo', 'gear', 'road', 'fleet', 'race', 'move']
  };

  // More diverse suffixes
  const suffixes = [
    'hub', 'spot', 'zone', 'place', 'base', 'center', 'space', 'pro', 'expert', 'group', 'team', 'labs', 
    'works', 'point', 'mind', 'peak', 'prime', 'plus', 'max', 'focus', 'craft', 'way', 'vista', 'bridge', 
    'path', 'gate', 'forge', 'link', 'pulse', 'spark', 'flow', 'wave', 'bold', 'unity', 'edge', 'core'
  ];
  
  // Random connectors for more variations
  const connectors = ['and', 'with', 'for', 'my', 'our', 'your', 'the', 'go', 'get', 'try', 'now', 'one', 'top', 'best'];

  // Random domain modifiers to increase uniqueness
  const modifiers = ['active', 'rapid', 'swift', 'easy', 'super', 'mega', 'ultra', 'power', 'prime', 'ace', 'key', 'true', 'pure', 'next'];

  const generateRandomElement = <T extends unknown>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const generateDomainNames = () => {
    if (!keywords && !industry) {
      toast.error(t('domainCreator.errors.noInput'), {
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
      
      // Maximum domains to generate to prevent overloading
      const maxDomains = 50;
      const uniqueResults = new Set<string>();
      
      // Helper function to add domain with randomness
      const addDomain = (domain: string, tld: string) => {
        // 50% chance to apply random transformation
        if (uniqueResults.size < maxDomains && Math.random() > 0.5) {
          uniqueResults.add(`${domain}.${tld}`);
        }
        
        // 25% chance to add a random modifier before domain
        if (uniqueResults.size < maxDomains && Math.random() > 0.75) {
          const modifier = generateRandomElement(modifiers);
          uniqueResults.add(`${modifier}${domain}.${tld}`);
        }
        
        // 25% chance to add a random suffix
        if (uniqueResults.size < maxDomains && Math.random() > 0.75) {
          const suffix = generateRandomElement(suffixes);
          uniqueResults.add(`${domain}${suffix}.${tld}`);
        }
      };
      
      // Generowanie z słów kluczowych
      if (keywordList.length > 0) {
        // Generate for each keyword
        keywordList.forEach(keyword => {
          includeTld.forEach(tld => {
            // Base domain with just the keyword
            addDomain(keyword, tld);
            
            // With industry prefix if available
            if (industryPrefixes && industryPrefixes.length > 0) {
              // Pick random prefix from the industry (don't use all)
              const prefix = generateRandomElement(industryPrefixes);
              addDomain(`${prefix}${keyword}`, tld);
              
              // Sometimes add a dash for readability
              if (Math.random() > 0.7) {
                addDomain(`${prefix}-${keyword}`, tld);
              }
            }
            
            // Random suffix combination
            const suffix = generateRandomElement(suffixes);
            addDomain(`${keyword}${suffix}`, tld);
            
            // Random connector
            if (Math.random() > 0.7) {
              const connector = generateRandomElement(connectors);
              addDomain(`${keyword}${connector}`, tld);
            }
          });
        });
        
        // Combine keywords randomly (if multiple keywords)
        if (keywordList.length > 1) {
          for (let i = 0; i < Math.min(10, keywordList.length); i++) {
            const keyword1 = generateRandomElement(keywordList);
            const keyword2 = generateRandomElement(keywordList.filter(k => k !== keyword1));
            
            if (keyword2) {
              includeTld.forEach(tld => {
                // Direct combination
                addDomain(`${keyword1}${keyword2}`, tld);
                
                // With separator
                if (Math.random() > 0.6) {
                  addDomain(`${keyword1}-${keyword2}`, tld);
                }
              });
            }
          }
        }
      } 
      // Generowanie tylko na podstawie branży
      else if (industry) {
        // Generate more creative combinations with industry terms
        for (let i = 0; i < 15; i++) {
          const prefix = generateRandomElement(industryPrefixes);
          const suffix = generateRandomElement(suffixes);
          includeTld.forEach(tld => {
            addDomain(`${prefix}${suffix}`, tld);
            
            // Add some with random modifiers
            if (Math.random() > 0.6) {
              const modifier = generateRandomElement(modifiers);
              addDomain(`${modifier}${prefix}`, tld);
            }
          });
        }
      }
      
      // Ensure we have enough domains
      if (uniqueResults.size < 20 && (keywordList.length > 0 || industry)) {
        // Add some completely random but still relevant combinations
        for (let i = uniqueResults.size; i < 20; i++) {
          const elements = [
            ...(keywordList.length > 0 ? keywordList : []),
            ...(industryPrefixes || []),
            ...(Math.random() > 0.7 ? [generateRandomElement(suffixes)] : []),
            ...(Math.random() > 0.8 ? [generateRandomElement(modifiers)] : [])
          ];
          
          if (elements.length > 1) {
            const randomElement1 = elements[Math.floor(Math.random() * elements.length)];
            const randomElement2 = elements[Math.floor(Math.random() * elements.length)];
            
            if (randomElement1 !== randomElement2) {
              const tld = generateRandomElement(includeTld);
              addDomain(`${randomElement1}${randomElement2}`, tld);
            }
          }
        }
      }
      
      // Convert set to array and limit to maxDomains
      setGeneratedDomains(Array.from(uniqueResults).slice(0, maxDomains));
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (domain: string) => {
    navigator.clipboard.writeText(domain);
    toast.success(t('domainCreator.copied', { domain }), {
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
        <title>{t('domainCreator.pageTitle')}</title>
        <meta name="description" content={t('domainCreator.pageDescription')} />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">{t('domainCreator.title')}</h1>
            <p className="text-lg mb-10 text-center">
              {t('domainCreator.subtitle')}
            </p>
            
            <Card className="mb-10">
              <CardHeader>
                <CardTitle>{t('domainCreator.form.details')}</CardTitle>
                <CardDescription>{t('domainCreator.form.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">{t('domainCreator.form.keywords')}</label>
                    <Input
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder={t('domainCreator.form.keywordsPlaceholder')}
                    />
                    <p className="text-sm mt-1 opacity-70">
                      {t('domainCreator.form.keywordsExample')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block mb-2">{t('domainCreator.form.industry')}</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('domainCreator.form.industryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('domainCreator.form.anyIndustry')}</SelectItem>
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
                  <label className="block mb-2">{t('domainCreator.form.extensions')}</label>
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
                      {t('domainCreator.form.generating')}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> {t('domainCreator.form.generate')}
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
                <h2 className="text-xl font-bold mb-4">{t('domainCreator.results.title')}</h2>
                
                {favorites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" /> {t('domainCreator.results.favorites')}
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
                              title={t('domainCreator.actions.copy')}
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleFavorite(domain)}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                              title={t('domainCreator.actions.removeFromFavorites')}
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
                            title={t('domainCreator.actions.copy')}
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleFavorite(domain)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            title={t('domainCreator.actions.addToFavorites')}
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
              <h2 className="text-xl font-bold mb-4">{t('domainCreator.tips.title')}</h2>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{t('domainCreator.tips.tip1')}</li>
                <li>{t('domainCreator.tips.tip2')}</li>
                <li>{t('domainCreator.tips.tip3')}</li>
                <li>{t('domainCreator.tips.tip4')}</li>
                <li>{t('domainCreator.tips.tip5')}</li>
                <li>{t('domainCreator.tips.tip6')}</li>
              </ul>
              
              <p>
                {t('domainCreator.tips.conclusion')}
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
