
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn, Menu } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          className={`md:hidden ${textColor}`}
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className={`h-[85vh] neo-blur ${theme === 'light' ? 'bg-white/80' : 'bg-black/80'} backdrop-blur-md border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
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
                className={`${textColor}`}
              >
                {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
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
                  className={`${textColor}`}
                >
                  <LogIn className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">{isAuthenticated ? "Panel administracyjny" : "Zaloguj"}</span>
                </Button>
              </Link>
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-hidden pr-2">
            <nav className="flex flex-col space-y-2">
              <Link to="/" 
                className={`${textColor} text-lg px-3 py-3 rounded-lg transition-colors ${isActive('/') ? 'font-bold border-b-2 border-premium-blue' : ''}`}
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
                  <AccordionTrigger className={`${textColor} text-lg px-3 py-2 ${(isActive('/tworzenie-stron-www') || isActive('/sklepy-internetowe') || isActive('/pozycjonowanie-stron') || isActive('/pozycjonowanie-lokalne') || isActive('/audyt-seo') || isActive('/optymalizacja-seo') || isActive('/copywriting-seo') || isActive('/content-plan')) ? 'font-bold border-b-2 border-premium-blue' : ''}`}>
                    Oferta
                  </AccordionTrigger>
                  <AccordionContent className="max-h-[250px] overflow-y-auto">
                    <div className="space-y-2 pl-2">
                      <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 mt-2`}>Strony www</h3>
                      <Link to="/tworzenie-stron-www" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/tworzenie-stron-www') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Tworzenie stron www
                      </Link>
                      <Link to="/sklepy-internetowe" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/sklepy-internetowe') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Tworzenie sklepów internetowych
                      </Link>
                    
                      <h3 className={`${theme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm font-semibold px-3 mt-4`}>Pozycjonowanie (SEO)</h3>
                      <Link to="/pozycjonowanie-stron" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/pozycjonowanie-stron') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Pozycjonowanie stron internetowych
                      </Link>
                      <Link to="/pozycjonowanie-lokalne" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/pozycjonowanie-lokalne') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Pozycjonowanie lokalne
                      </Link>
                      <Link to="/audyt-seo" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/audyt-seo') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Audyt SEO
                      </Link>
                      <Link to="/optymalizacja-seo" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/optymalizacja-seo') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Optymalizacja SEO
                      </Link>
                      <Link to="/copywriting-seo" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/copywriting-seo') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Copywriting SEO
                      </Link>
                      <Link to="/content-plan" 
                        className={`${textColor} block transition-colors px-3 py-2 rounded-lg ${isActive('/content-plan') ? 'font-bold border-b border-premium-blue' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Content Plan
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Link to="/projects" 
                className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/projects') ? 'font-bold border-b-2 border-premium-blue' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              
              <Link to="/about" 
                className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/about') ? 'font-bold border-b-2 border-premium-blue' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                O nas
              </Link>
              
              <Link to="/blog" 
                className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/blog') ? 'font-bold border-b-2 border-premium-blue' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              
              <Link to="/contact" 
                className={`${textColor} text-lg transition-colors px-3 py-3 rounded-lg ${isActive('/contact') ? 'font-bold border-b-2 border-premium-blue' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
            </nav>
          </ScrollArea>
          
          <Link to="/contact" className="mt-6" onClick={() => {
            setIsMenuOpen(false);
            // Ensure scrolling is restored
            document.body.style.overflow = '';
          }}>
            <Button className={`w-full ${theme === 'light' ? 'bg-black' : 'bg-black'} ${theme === 'light' ? 'text-white' : 'text-white'}`}>
              Umów spotkanie
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
