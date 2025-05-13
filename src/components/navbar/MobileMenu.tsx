
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { theme } = useTheme();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const linkClass = (active: boolean) => cn(
    "block w-full text-left px-4 py-2 my-1 rounded-md transition-colors",
    {
      "text-white hover:bg-white hover:text-black": theme === 'dark',
      "text-black hover:bg-black hover:text-white": theme === 'light',
      "bg-premium-gradient text-white": active
    }
  );
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
      >
        <span className="sr-only">{isMenuOpen ? "Zamknij menu" : "Otwórz menu"}</span>
        {isMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
      
      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobilne"
        >
          <div className="flex flex-col h-full p-4 pt-20">
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-md text-white"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Zamknij menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <nav className="flex-1 overflow-y-auto">
              <div className="space-y-2 py-4">
                <Link 
                  to="/" 
                  className={linkClass(isActive('/'))}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Strona główna
                </Link>
                
                <Accordion type="single" collapsible className="border-none">
                  <AccordionItem value="services" className="border-none">
                    <AccordionTrigger className={cn(
                      "px-4 py-2 my-1 rounded-md transition-colors",
                      "text-white hover:bg-white/10"
                    )}>
                      Usługi
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-1">
                        <Link 
                          to="/tworzenie-stron-www" 
                          className={linkClass(isActive('/tworzenie-stron-www'))}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Strony internetowe
                        </Link>
                        <Link 
                          to="/sklepy-internetowe" 
                          className={linkClass(isActive('/sklepy-internetowe'))}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sklepy internetowe
                        </Link>
                        <Link 
                          to="/pozycjonowanie-stron" 
                          className={linkClass(isActive('/pozycjonowanie-stron'))}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Pozycjonowanie
                        </Link>
                        <Link 
                          to="/kampanie-google-ads" 
                          className={linkClass(isActive('/kampanie-google-ads'))}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Google Ads
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Link 
                  to="/projects" 
                  className={linkClass(isActive('/projects'))}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portfolio
                </Link>
                
                <Link 
                  to="/blog" 
                  className={linkClass(isActive('/blog'))}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                
                <Link 
                  to="/about" 
                  className={linkClass(isActive('/about'))}
                  onClick={() => setIsMenuOpen(false)}
                >
                  O nas
                </Link>
                
                <Link 
                  to="/contact" 
                  className={linkClass(isActive('/contact'))}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
