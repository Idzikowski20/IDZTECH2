
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/utils/themeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const NameGenerator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [keywords, setKeywords] = useState<string>('');
  const [type, setType] = useState<string>('business');
  const [mood, setMood] = useState<string>('professional');
  const [language, setLanguage] = useState<string>('auto');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [favoriteNames, setFavoriteNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const generateNameOptions = () => {
    if (!keywords.trim()) {
      toast.error(t('nameGenerator.errors.noInput'));
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const keywordsArr = keywords.split(',').map(k => k.trim());
      const generatedOptions: string[] = [];
      
      // Business names
      if (type === 'business') {
        for (let i = 0; i < 10; i++) {
          const randomWord = keywordsArr[Math.floor(Math.random() * keywordsArr.length)];
          const suffixes = ['Tech', 'Solutions', 'Pro', 'Connect', 'Hub', 'Labs', 'Group', 'Systems'];
          const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
          generatedOptions.push(randomWord + randomSuffix);
        }
      } 
      // Product names
      else if (type === 'product') {
        for (let i = 0; i < 10; i++) {
          const randomWord = keywordsArr[Math.floor(Math.random() * keywordsArr.length)];
          const prefixes = ['Ultra', 'Pro', 'Max', 'Elite', 'Prime', 'Smart', 'Next', 'Flex'];
          const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          generatedOptions.push(randomPrefix + randomWord);
        }
      } 
      // Domain names
      else if (type === 'domain') {
        for (let i = 0; i < 10; i++) {
          const randomWord = keywordsArr[Math.floor(Math.random() * keywordsArr.length)];
          const extensions = ['.com', '.io', '.co', '.net', '.app', '.tech', '.biz'];
          const randomExt = extensions[Math.floor(Math.random() * extensions.length)];
          generatedOptions.push(randomWord.toLowerCase() + randomExt);
        }
      }
      
      setGeneratedNames(generatedOptions);
      setIsGenerating(false);
    }, 1500);
  };
  
  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopied(name);
    toast.success(t('nameGenerator.copied', { name }));
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };
  
  const toggleFavorite = (name: string) => {
    if (favoriteNames.includes(name)) {
      setFavoriteNames(favoriteNames.filter(n => n !== name));
    } else {
      setFavoriteNames([...favoriteNames, name]);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className={`text-4xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {t('nameGenerator.title')}
            </h1>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              {t('nameGenerator.subtitle')}
            </p>
          </div>
          
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">{t('nameGenerator.form.generate')}</TabsTrigger>
              <TabsTrigger value="favorites">{t('nameGenerator.results.favorites')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('nameGenerator.form.details')}</CardTitle>
                  <CardDescription>{t('nameGenerator.form.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keywords">{t('nameGenerator.form.keywords')}</Label>
                    <Input
                      id="keywords"
                      placeholder={t('nameGenerator.form.keywordsPlaceholder')}
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">{t('nameGenerator.form.keywordsExample')}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">{t('nameGenerator.form.type')}</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder={t('nameGenerator.form.typePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">{t('nameGenerator.types.business')}</SelectItem>
                          <SelectItem value="product">{t('nameGenerator.types.product')}</SelectItem>
                          <SelectItem value="domain">{t('nameGenerator.types.domain')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mood">{t('nameGenerator.form.mood')}</Label>
                      <Select value={mood} onValueChange={setMood}>
                        <SelectTrigger id="mood">
                          <SelectValue placeholder={t('nameGenerator.form.moodPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">{t('nameGenerator.moods.professional')}</SelectItem>
                          <SelectItem value="creative">{t('nameGenerator.moods.creative')}</SelectItem>
                          <SelectItem value="fun">{t('nameGenerator.moods.fun')}</SelectItem>
                          <SelectItem value="technical">{t('nameGenerator.moods.technical')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">{t('nameGenerator.form.language')}</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder={t('nameGenerator.form.languagePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">{t('nameGenerator.languages.auto')}</SelectItem>
                          <SelectItem value="en">{t('nameGenerator.languages.english')}</SelectItem>
                          <SelectItem value="pl">{t('nameGenerator.languages.polish')}</SelectItem>
                          <SelectItem value="de">{t('nameGenerator.languages.german')}</SelectItem>
                          <SelectItem value="fr">{t('nameGenerator.languages.french')}</SelectItem>
                          <SelectItem value="es">{t('nameGenerator.languages.spanish')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={generateNameOptions}
                    disabled={isGenerating}
                  >
                    {isGenerating ? t('nameGenerator.form.generating') : t('nameGenerator.form.generate')}
                  </Button>
                </CardFooter>
              </Card>
              
              {generatedNames.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('nameGenerator.results.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatedNames.map((name, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border flex justify-between items-center ${
                            theme === 'light' 
                              ? 'bg-white hover:bg-gray-50' 
                              : 'bg-gray-900 hover:bg-gray-800'
                          }`}
                        >
                          <span className="font-medium">{name}</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleFavorite(name)}
                              className="text-gray-500 hover:text-amber-500"
                            >
                              {favoriteNames.includes(name) ? 
                                '★' : '☆'}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(name)}
                              className={`${
                                copied === name ? 'text-green-500' : 'text-gray-500'
                              }`}
                            >
                              {copied === name ? 
                                <CheckCircle className="h-4 w-4" /> : 
                                <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>{t('nameGenerator.results.favorites')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {favoriteNames.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">
                      {t('nameGenerator.favorites.empty')}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {favoriteNames.map((name, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border flex justify-between items-center ${
                            theme === 'light' 
                              ? 'bg-white hover:bg-gray-50' 
                              : 'bg-gray-900 hover:bg-gray-800'
                          }`}
                        >
                          <span className="font-medium">{name}</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleFavorite(name)}
                              className="text-amber-500"
                            >
                              ★
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(name)}
                              className={`${
                                copied === name ? 'text-green-500' : 'text-gray-500'
                              }`}
                            >
                              {copied === name ? 
                                <CheckCircle className="h-4 w-4" /> : 
                                <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>{t('nameGenerator.tips.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('nameGenerator.tips.tip1')}</li>
                <li>{t('nameGenerator.tips.tip2')}</li>
                <li>{t('nameGenerator.tips.tip3')}</li>
                <li>{t('nameGenerator.tips.tip4')}</li>
                <li>{t('nameGenerator.tips.tip5')}</li>
              </ul>
              <p className="pt-3">{t('nameGenerator.tips.conclusion')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NameGenerator;
