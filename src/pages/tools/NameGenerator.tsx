
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/themeContext';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import PageDotAnimation from '@/components/PageDotAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Heart, X } from 'lucide-react';
import { toast } from 'sonner';

const NameGenerator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('');
  const [nameType, setNameType] = useState('business');
  const [includeAdjectives, setIncludeAdjectives] = useState(true);
  const [includeVerbs, setIncludeVerbs] = useState(false);
  
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const industries = [
    { value: 'tech', label: t('tools.nameGenerator.industries.tech') },
    { value: 'health', label: t('tools.nameGenerator.industries.health') },
    { value: 'finance', label: t('tools.nameGenerator.industries.finance') },
    { value: 'education', label: t('tools.nameGenerator.industries.education') },
    { value: 'food', label: t('tools.nameGenerator.industries.food') },
    { value: 'fashion', label: t('tools.nameGenerator.industries.fashion') },
    { value: 'travel', label: t('tools.nameGenerator.industries.travel') },
    { value: 'creative', label: t('tools.nameGenerator.industries.creative') }
  ];
  
  const nameTypes = [
    { value: 'business', label: t('tools.nameGenerator.types.business') },
    { value: 'product', label: t('tools.nameGenerator.types.product') },
    { value: 'brand', label: t('tools.nameGenerator.types.brand') },
    { value: 'personal', label: t('tools.nameGenerator.types.personal') }
  ];
  
  // Word banks based on industry
  const adjectives: Record<string, string[]> = {
    tech: ['Smart', 'Digital', 'Cyber', 'Quantum', 'Novel', 'Prime', 'Fusion', 'Epic'],
    health: ['Vital', 'Remedy', 'Pure', 'Healing', 'Wellness', 'Serene', 'Natural', 'Balance'],
    finance: ['Capital', 'Wealth', 'Equity', 'Trust', 'Secure', 'Prosper', 'Asset', 'Growth'],
    education: ['Scholar', 'Mentor', 'Bright', 'Intellect', 'Wisdom', 'Academic', 'Genius', 'Insight'],
    food: ['Tasty', 'Delicious', 'Flavor', 'Juicy', 'Savory', 'Gourmet', 'Fresh', 'Crisp'],
    fashion: ['Chic', 'Style', 'Glam', 'Elite', 'Luxe', 'Trendy', 'Elegant', 'Couture'],
    travel: ['Wander', 'Voyage', 'Journey', 'Adventure', 'Global', 'Nomad', 'Explore', 'Discover'],
    creative: ['Artsy', 'Creative', 'Design', 'Vision', 'Imagine', 'Inspire', 'Dream', 'Craft'],
    default: ['Premium', 'Elite', 'Advanced', 'Super', 'Mega', 'Ultra', 'Pro', 'Supreme', 'Best']
  };
  
  const nouns: Record<string, string[]> = {
    tech: ['Tech', 'Byte', 'Code', 'Data', 'Wave', 'Cloud', 'Logic', 'Pixel', 'Neural'],
    health: ['Health', 'Life', 'Vigor', 'Care', 'Pulse', 'Bloom', 'Zen', 'Core', 'Thrive'],
    finance: ['Money', 'Fund', 'Cash', 'Bank', 'Wealth', 'Stock', 'Profit', 'Fortune', 'Credit'],
    education: ['Learn', 'Study', 'Mind', 'Knowledge', 'School', 'Lesson', 'Course', 'Class', 'Academy'],
    food: ['Taste', 'Flavor', 'Spice', 'Bite', 'Dish', 'Meal', 'Plate', 'Chef', 'Kitchen'],
    fashion: ['Style', 'Trend', 'Mode', 'Wear', 'Design', 'Look', 'Chic', 'Vogue', 'Fashion'],
    travel: ['Trip', 'Tour', 'Trek', 'Path', 'World', 'Way', 'Route', 'Place', 'Voyage'],
    creative: ['Art', 'Design', 'Idea', 'Create', 'Studio', 'Work', 'Craft', 'Vision', 'Concept'],
    default: ['Solutions', 'System', 'Group', 'Hub', 'Center', 'Space', 'Zone', 'Spot', 'Place']
  };
  
  const verbs: Record<string, string[]> = {
    tech: ['Connect', 'Code', 'Compute', 'Process', 'Develop', 'Engineer', 'Build', 'Deploy'],
    health: ['Heal', 'Restore', 'Revive', 'Nurture', 'Cure', 'Treat', 'Mend', 'Rejuvenate'],
    finance: ['Invest', 'Grow', 'Save', 'Profit', 'Trade', 'Budget', 'Fund', 'Finance'],
    education: ['Teach', 'Learn', 'Study', 'Read', 'Educate', 'Mentor', 'Train', 'Develop'],
    food: ['Cook', 'Bake', 'Serve', 'Taste', 'Flavor', 'Prepare', 'Create', 'Nourish'],
    fashion: ['Style', 'Design', 'Craft', 'Wear', 'Create', 'Tailor', 'Fashion', 'Accessorize'],
    travel: ['Explore', 'Journey', 'Travel', 'Discover', 'Wander', 'Visit', 'Navigate', 'Tour'],
    creative: ['Create', 'Design', 'Craft', 'Make', 'Build', 'Imagine', 'Inspire', 'Develop'],
    default: ['Start', 'Make', 'Build', 'Create', 'Form', 'Launch', 'Develop', 'Produce']
  };
  
  const generateRandomName = () => {
    const currentIndustry = industry || 'default';
    const industryAdjectives = adjectives[currentIndustry] || adjectives.default;
    const industryNouns = nouns[currentIndustry] || nouns.default;
    const industryVerbs = verbs[currentIndustry] || verbs.default;
    
    const keywordArray = keyword.trim() ? keyword.split(',').map(k => k.trim()) : [];
    const randomAdjective = includeAdjectives ? industryAdjectives[Math.floor(Math.random() * industryAdjectives.length)] : '';
    const randomNoun = industryNouns[Math.floor(Math.random() * industryNouns.length)];
    const randomVerb = includeVerbs ? industryVerbs[Math.floor(Math.random() * industryVerbs.length)] : '';
    
    let name = '';
    
    if (keywordArray.length > 0 && Math.random() > 0.5) {
      const randomKeyword = keywordArray[Math.floor(Math.random() * keywordArray.length)];
      
      const patterns = [
        () => randomAdjective && randomNoun ? `${randomAdjective} ${randomKeyword}` : `${randomKeyword} ${randomNoun}`,
        () => randomAdjective && randomNoun ? `${randomKeyword} ${randomNoun}` : `${randomAdjective} ${randomKeyword}`,
        () => randomVerb && randomNoun ? `${randomVerb}${randomKeyword}` : `${randomKeyword}${randomNoun}`,
        () => `${randomKeyword} ${randomNoun}`
      ];
      
      const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
      name = selectedPattern();
    } else {
      const patterns = [
        () => randomAdjective && randomNoun ? `${randomAdjective} ${randomNoun}` : randomNoun,
        () => randomVerb && randomNoun ? `${randomVerb} ${randomNoun}` : randomNoun,
        () => randomAdjective && randomVerb && randomNoun ? `${randomAdjective} ${randomVerb}` : randomNoun,
        () => randomAdjective && randomVerb ? `${randomAdjective}${randomVerb}` : randomNoun
      ];
      
      const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
      name = selectedPattern();
    }
    
    // Ensure capitalized words
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleGenerate = () => {
    if (!keyword.trim() && !industry) {
      toast.error(t('tools.nameGenerator.errors.noInput'));
      return;
    }

    setIsGenerating(true);
    
    // Generate names (simulate some delay for effect)
    setTimeout(() => {
      const newNames = Array.from({ length: 10 }, () => generateRandomName());
      setGeneratedNames(newNames);
      setIsGenerating(false);
    }, 500);
  };
  
  const addToFavorites = (name: string) => {
    if (!favorites.includes(name)) {
      setFavorites([...favorites, name]);
      toast.success(t('tools.nameGenerator.favoriteAdded'));
    }
  };
  
  const removeFromFavorites = (name: string) => {
    setFavorites(favorites.filter(item => item !== name));
    toast.info(t('tools.nameGenerator.favoriteRemoved'));
  };
  
  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success(t('tools.nameGenerator.copied').replace('{{name}}', name));
  };
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      <Navbar />
      <PageDotAnimation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl font-bold mb-4 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>
            {t('tools.nameGenerator.title')}
          </h1>
          <p className={`text-center mb-10 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {t('tools.nameGenerator.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
              <CardHeader>
                <CardTitle>{t('tools.nameGenerator.form.details')}</CardTitle>
                <CardDescription>
                  {t('tools.nameGenerator.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyword">{t('tools.nameGenerator.form.keywords')}</Label>
                  <Input
                    id="keyword"
                    placeholder={t('tools.nameGenerator.form.keywordsPlaceholder')}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className={theme === 'light' ? '' : 'bg-gray-700 border-gray-600'}
                  />
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('tools.nameGenerator.form.keywordsExample')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">{t('tools.nameGenerator.form.industry')}</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className={theme === 'light' ? '' : 'bg-gray-700 border-gray-600'}>
                      <SelectValue placeholder={t('tools.nameGenerator.form.industryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className={theme === 'light' ? '' : 'bg-gray-700 border-gray-600'}>
                      <SelectItem value="">{t('tools.nameGenerator.form.anyIndustry')}</SelectItem>
                      {industries.map(ind => (
                        <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameType">{t('tools.nameGenerator.form.nameType')}</Label>
                  <Select value={nameType} onValueChange={setNameType}>
                    <SelectTrigger className={theme === 'light' ? '' : 'bg-gray-700 border-gray-600'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={theme === 'light' ? '' : 'bg-gray-700 border-gray-600'}>
                      {nameTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">{t('tools.nameGenerator.form.options')}</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="use-adjectives" 
                      checked={includeAdjectives} 
                      onCheckedChange={(checked) => setIncludeAdjectives(checked === true)}
                    />
                    <label
                      htmlFor="use-adjectives"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
                    >
                      {t('tools.nameGenerator.form.useAdjectives')}
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="use-verbs" 
                      checked={includeVerbs} 
                      onCheckedChange={(checked) => setIncludeVerbs(checked === true)}
                    />
                    <label
                      htmlFor="use-verbs"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
                    >
                      {t('tools.nameGenerator.form.useVerbs')}
                    </label>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  className="w-full" 
                  disabled={isGenerating}
                >
                  {isGenerating ? t('tools.nameGenerator.form.generating') : t('tools.nameGenerator.form.generate')}
                </Button>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="results" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="results">{t('tools.nameGenerator.results.title')}</TabsTrigger>
                  <TabsTrigger value="favorites">{t('tools.nameGenerator.results.favorites')} {favorites.length > 0 && `(${favorites.length})`}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="results">
                  <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
                    <CardHeader>
                      <CardTitle>{t('tools.nameGenerator.results.title')}</CardTitle>
                      <CardDescription>
                        {generatedNames.length > 0 
                          ? t('tools.nameGenerator.results.description') 
                          : t('tools.nameGenerator.results.empty')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {generatedNames.length > 0 ? (
                        <div className="space-y-2">
                          {generatedNames.map((name, index) => (
                            <div 
                              key={`${name}-${index}`}
                              className={`p-3 flex items-center justify-between rounded-md ${
                                theme === 'light' 
                                  ? 'bg-gray-50 hover:bg-gray-100' 
                                  : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                            >
                              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                                {name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => copyToClipboard(name)}
                                  className={theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-500'}
                                >
                                  <Copy className="w-4 h-4" />
                                  <span className="sr-only">{t('tools.nameGenerator.actions.copy')}</span>
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => addToFavorites(name)}
                                  disabled={favorites.includes(name)}
                                  className={theme === 'light' 
                                    ? 'hover:bg-gray-200' 
                                    : 'hover:bg-gray-500'
                                  }
                                >
                                  <Heart className={`w-4 h-4 ${favorites.includes(name) ? 'fill-red-500 text-red-500' : ''}`} />
                                  <span className="sr-only">{t('tools.nameGenerator.actions.addToFavorites')}</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-10 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {isGenerating 
                            ? t('tools.nameGenerator.form.generating')
                            : t('tools.nameGenerator.results.noResults')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="favorites">
                  <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
                    <CardHeader>
                      <CardTitle>{t('tools.nameGenerator.results.favorites')}</CardTitle>
                      <CardDescription>
                        {favorites.length > 0 
                          ? t('tools.nameGenerator.results.favoritesDescription') 
                          : t('tools.nameGenerator.results.noFavorites')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {favorites.length > 0 ? (
                        <div className="space-y-2">
                          {favorites.map((name, index) => (
                            <div 
                              key={`fav-${name}-${index}`}
                              className={`p-3 flex items-center justify-between rounded-md ${
                                theme === 'light' 
                                  ? 'bg-gray-50 hover:bg-gray-100' 
                                  : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                            >
                              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                                {name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => copyToClipboard(name)}
                                  className={theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-500'}
                                >
                                  <Copy className="w-4 h-4" />
                                  <span className="sr-only">{t('tools.nameGenerator.actions.copy')}</span>
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => removeFromFavorites(name)}
                                  className={theme === 'light' 
                                    ? 'hover:bg-gray-200 hover:text-red-500' 
                                    : 'hover:bg-gray-500 hover:text-red-400'
                                  }
                                >
                                  <X className="w-4 h-4" />
                                  <span className="sr-only">{t('tools.nameGenerator.actions.removeFromFavorites')}</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-10 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('tools.nameGenerator.results.noFavorites')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className={`mt-6 p-4 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  {t('tools.nameGenerator.tips.title')}
                </h3>
                <ul className={`list-disc list-inside space-y-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  <li>{t('tools.nameGenerator.tips.tip1')}</li>
                  <li>{t('tools.nameGenerator.tips.tip2')}</li>
                  <li>{t('tools.nameGenerator.tips.tip3')}</li>
                  <li>{t('tools.nameGenerator.tips.tip4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NameGenerator;
