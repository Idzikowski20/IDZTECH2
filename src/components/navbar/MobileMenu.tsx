import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn, Menu } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const location = useLocation();
  
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
      <DrawerContent className={`h-[85vh] ${theme === 'light' ? 'bg-white' : 'bg-black'} border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
        <div className="px-6 py-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-bold ${textColor}`}>Menu</h2>
            <div className="flex items-center space-x-4">
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
                  <span className="sr-only">{isAuthenticated ? "Panel administracyjny" : "Zaloguj"}</span>
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
              Start
            </Link>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="offer" className={theme === 'light' ? 'border-gray-200' : 'border-white/10'}>
                <AccordionTrigger className={`${textColor} text-lg px-3 py-2 ${(isActive('/tworzenie-stron-www') || isActive('/sklepy-internetowe') || isActive('/pozycjonowanie-stron') || isActive('/pozycjonowanie-lokalne') || isActive('/audyt-seo') || isActive('/optymalizacja-seo') || isActive('/copywriting-seo') || isActive('/content-plan')) ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}>
                  Oferta
                </AccordionTrigger>
                <AccordionContent className="max-h-[250px] overflow-y-auto">
                  <div className="space-y-2 pl-2">
                    <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 mt-2`}>Strony www</h3>
                    <Link to="/tworzenie-stron-www" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/tworzenie-stron-www') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/tworzenie-stron-www') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tworzenie stron www
                    </Link>
                    <Link to="/sklepy-internetowe" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/sklepy-internetowe') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/sklepy-internetowe') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tworzenie sklepów internetowych
                    </Link>
                  
                    <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 mt-4`}>Pozycjonowanie (SEO)</h3>
                    <Link to="/pozycjonowanie-stron" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/pozycjonowanie-stron') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/pozycjonowanie-stron') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pozycjonowanie stron internetowych
                    </Link>
                    <Link to="/pozycjonowanie-lokalne" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/pozycjonowanie-lokalne') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/pozycjonowanie-lokalne') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pozycjonowanie lokalne
                    </Link>
                    <Link to="/audyt-seo" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/audyt-seo') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/audyt-seo') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Audyt SEO
                    </Link>
                    <Link to="/optymalizacja-seo" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/optymalizacja-seo') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/optymalizacja-seo') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Optymalizacja SEO
                    </Link>
                    <Link to="/copywriting-seo" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/copywriting-seo') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/copywriting-seo') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Copywriting SEO
                    </Link>
                    <Link to="/content-plan" 
                      className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${theme === 'light' ? (isActive('/content-plan') ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 hover:text-black') : (isActive('/content-plan') ? 'bg-white/20 text-white' : 'hover:bg-white/20 hover:text-white')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Content Plan
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Link to="/projects" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/projects') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            
            <Link to="/about" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/about') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              O nas
            </Link>
            
            <Link to="/blog" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/blog') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            <Link to="/contact" 
              className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/contact') ? 'font-bold' : ''} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
          </nav>
          
          <Link to="/contact" className="mt-6" onClick={() => {
            setIsMenuOpen(false);
            // Ensure scrolling is restored
            document.body.style.overflow = '';
          }}>
            <Button className={`w-full ${theme === 'light' ? 'bg-black' : 'bg-black'} ${theme === 'light' ? 'text-white' : 'text-white'} hover:bg-black hover:text-white`}>
              Umów spotkanie
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
