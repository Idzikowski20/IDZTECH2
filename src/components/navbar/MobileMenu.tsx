
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

  return (
    <Drawer open={isMenuOpen} onOpenChange={handleMenuOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white hover:bg-white hover:text-black"
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] neo-blur bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="px-6 py-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  toggleDarkMode();
                  trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
                }} 
                className="text-white hover:bg-white hover:text-black"
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
                  className="text-white hover:bg-white hover:text-black"
                >
                  <LogIn className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">{isAuthenticated ? "Panel administracyjny" : "Zaloguj"}</span>
                </Button>
              </Link>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto pr-2 flex flex-col space-y-2">
            <Link to="/" 
              className="text-white text-lg hover:bg-white hover:text-black px-3 py-3 rounded-lg transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                // Ensure scrolling is restored
                document.body.style.overflow = '';
              }}
            >
              Start
            </Link>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="offer" className="border-white/10">
                <AccordionTrigger className="text-white text-lg px-3 py-2">
                  Oferta
                </AccordionTrigger>
                <AccordionContent className="max-h-[250px] overflow-y-auto">
                  <div className="space-y-2 pl-2">
                    <h3 className="text-white/70 text-sm font-semibold px-3 mt-2">Strony www</h3>
                    <Link to="/tworzenie-stron-www" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tworzenie stron www
                    </Link>
                    <Link to="/sklepy-internetowe" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tworzenie sklepów internetowych
                    </Link>
                  
                    <h3 className="text-white/70 text-sm font-semibold px-3 mt-4">Pozycjonowanie (SEO)</h3>
                    <Link to="/pozycjonowanie-stron" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pozycjonowanie stron internetowych
                    </Link>
                    <Link to="/pozycjonowanie-lokalne" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pozycjonowanie lokalne
                    </Link>
                    <Link to="/audyt-seo" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Audyt SEO
                    </Link>
                    <Link to="/optymalizacja-seo" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Optymalizacja SEO
                    </Link>
                    <Link to="/copywriting-seo" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Copywriting SEO
                    </Link>
                    <Link to="/content-plan" 
                      className="text-white block hover:bg-white hover:text-black px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Content Plan
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Link to="/projects" 
              className="text-white text-lg hover:bg-white hover:text-black px-3 py-3 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            
            <Link to="/about" 
              className="text-white text-lg hover:bg-white hover:text-black px-3 py-3 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              O nas
            </Link>
            
            <Link to="/blog" 
              className="text-white text-lg hover:bg-white hover:text-black px-3 py-3 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            <Link to="/contact" 
              className="text-white text-lg hover:bg-white hover:text-black px-3 py-3 rounded-lg transition-colors"
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
            <Button className="w-full bg-black text-white hover:scale-110 transition-transform">
              Umów spotkanie
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
