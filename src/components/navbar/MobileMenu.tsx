
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn, Menu } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Handle menu closing and ensure scrolling is restored
  const handleMenuOpen = (open: boolean) => {
    setIsMenuOpen(open);
    
    // If closing menu, ensure scrolling is restored
    if (!open) {
      // Small delay to ensure animation completes
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
    }
  };
  
  // Cleanup function to ensure body scroll is restored when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Determine text color based on theme
  const textColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <Drawer open={isMenuOpen} onOpenChange={handleMenuOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`md:hidden ${textColor} hover:bg-transparent`}
        >
          <Menu className={`h-[1.2rem] w-[1.2rem] ${theme === 'light' ? 'text-black' : 'text-white'}`} />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className={`h-[85vh] neo-blur ${theme === 'light' ? 'bg-white/80' : 'bg-black/80'} backdrop-blur-md border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
        <div className="px-6 py-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-bold ${textColor}`}>Menu</h2>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  toggleDarkMode();
                  trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
                }} 
                className={`${textColor} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              >
                {theme === "light" ? 
                  <Moon className="h-[1.2rem] w-[1.2rem] text-black" /> : 
                  <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
                }
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <Link to={isAuthenticated ? "/admin" : "/login"} onClick={() => {
                setIsMenuOpen(false);
                // Ensure scrolling is restored
                document.body.style.overflow = '';
              }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${textColor} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                >
                  <LogIn className={`h-[1.2rem] w-[1.2rem] ${theme === 'light' ? 'text-black' : 'text-white'}`} />
                  <span className="sr-only">{isAuthenticated ? t('buttons.admin') : t('buttons.login')}</span>
                </Button>
              </Link>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto pr-2 flex flex-col space-y-2">
            <Link to="/" 
              className={`${textColor} text-lg px-3 py-3 rounded-lg transition-colors ${isActive('/') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => {
                setIsMenuOpen(false);
                // Ensure scrolling is restored
                document.body.style.overflow = '';
              }}
            >
              {t('navigation.start')}
            </Link>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="offer" className={theme === 'light' ? 'border-gray-200' : 'border-white/10'}>
                <AccordionTrigger className={`${textColor} text-lg px-3 py-2 ${(isActive('/tworzenie-stron-www') || isActive('/sklepy-internetowe') || isActive('/pozycjonowanie-stron') || isActive('/pozycjonowanie-lokalne') || isActive('/audyt-seo') || isActive('/optymalizacja-seo') || isActive('/copywriting-seo') || isActive('/content-plan')) ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}>
                  {t('navigation.services')}
                </AccordionTrigger>
                <AccordionContent className="max-h-[250px] overflow-y-auto">
                  <div className="space-y-2 pl-2">
                    <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 mt-2`}>
                      {t('websiteTypes.websites')}
                    </h3>
                    <Link to="/tworzenie-stron-www" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/tworzenie-stron-www') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('websiteTypes.webDevelopment')}
                    </Link>
                    <Link to="/sklepy-internetowe" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/sklepy-internetowe') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('websiteTypes.eCommerce')}
                    </Link>
                  
                    <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 mt-4`}>
                      {t('seo.title')}
                    </h3>
                    <Link to="/pozycjonowanie-stron" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/pozycjonowanie-stron') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('seo.seoServices')}
                    </Link>
                    <Link to="/pozycjonowanie-lokalne" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/pozycjonowanie-lokalne') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('seo.localSeo')}
                    </Link>
                    <Link to="/audyt-seo" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/audyt-seo') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('seo.seoAudit')}
                    </Link>
                    <Link to="/optymalizacja-seo" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/optymalizacja-seo') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('seo.seoOptimization')}
                    </Link>
                    <Link to="/copywriting-seo" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/copywriting-seo') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('seo.seoCopywriting')}
                    </Link>
                    <Link to="/content-plan" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/content-plan') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('seo.contentPlan')}
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tools" className={theme === 'light' ? 'border-gray-200' : 'border-white/10'}>
                <AccordionTrigger className={`${textColor} text-lg px-3 py-2 ${(isActive('/password-generator') || isActive('/privacy-policy-generator') || isActive('/domain-creator') || isActive('/name-generator')) ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}>
                  {t('navigation.tools')}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-2">
                    <Link to="/password-generator" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/password-generator') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('tools.passwordGenerator')}
                    </Link>
                    <Link to="/privacy-policy-generator" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/privacy-policy-generator') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('tools.privacyPolicyGenerator')}
                    </Link>
                    <Link to="/domain-creator" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/domain-creator') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('tools.domainCreator')}
                    </Link>
                    <Link to="/name-generator" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/name-generator') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('tools.nameGenerator')}
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Link to="/projects" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/projects') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.portfolio')}
            </Link>
            
            <Link to="/about" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/about') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.about')}
            </Link>
            
            <Link to="/blog" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/blog') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.blog')}
            </Link>
            
            <Link to="/contact" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/contact') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.contact')}
            </Link>
          </nav>
          
          <Link to="/contact" className="mt-6" onClick={() => {
            setIsMenuOpen(false);
            // Ensure scrolling is restored
            document.body.style.overflow = '';
          }}>
            <Button className={`w-full ${theme === 'light' ? 'bg-black' : 'bg-black'} ${theme === 'light' ? 'text-white' : 'text-white'} hover:bg-black hover:text-white`}>
              {t('buttons.meeting')}
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
