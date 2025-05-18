
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const languages = [
  { code: 'pl', name: 'Polski' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
];

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
    // Save user's choice in localStorage
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLanguage = languages.find(lng => lng.code === i18n.language)?.name || 'Polski';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`${
            theme === 'light' 
              ? 'text-black hover:bg-gray-100' 
              : 'text-white hover:bg-white/10'
          } flex items-center gap-2`}
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="hidden md:inline">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} p-2 z-50`}
      >
        {languages.map((lng) => (
          <DropdownMenuItem
            key={lng.code}
            onClick={() => changeLanguage(lng.code)}
            className={`${
              i18n.language === lng.code 
                ? 'font-bold' 
                : 'font-normal'
            } ${
              theme === 'light'
                ? 'text-black hover:bg-gray-100'
                : 'text-white hover:bg-gray-700'
            } cursor-pointer`}
          >
            {lng.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
