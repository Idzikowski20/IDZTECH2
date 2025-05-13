
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
  
  const linkClass = cn(
    "block w-full text-left px-4 py-2 my-1 rounded-md transition-colors",
    theme === 'light' 
      ? 'text-black hover:bg-gray-100 hover:text-black' 
      : 'text-white hover:bg-white/10 hover:text-white'
  );
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className={`lg:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
          theme === 'light' ? 'text-black hover:bg-gray-200' : 'text-white hover:bg-white/10'
        }`}
        onClick={toggleMenu}
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
          className={`fixed inset-0 z-50 lg:hidden ${theme === 'light' ? 'bg-white' : 'bg-black'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobilne"
        >
          <div className="flex flex-col h-full p-4 pt-20">
            <button
              type="button"
              className={`absolute top-4 right-4 p-2 rounded-md ${
                theme === 'light' ? 'text-black hover:bg-gray-200' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Zamknij menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <nav className="flex-1 overflow-y-auto" role="navigation" aria-label="Menu mobilne">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className={`${linkClass} ${isActive('/') ? 'font-bold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Start
                </Link>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="services" className="border-none">
                    <AccordionTrigger 
                      className={`${linkClass} flex justify-between items-center`}
                      aria-label="Usługi - rozwiń menu"
                    >
                      Usługi
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-1">
                        <p className={`font-medium mt-2 mb-1 px-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Strony www</p>
                        <Link 
                          to="/tworzenie-stron-www" 
                          className={`${linkClass} ${isActive('/tworzenie-stron-www') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/tworzenie-stron-www') ? 'page' : undefined}
                        >
                          Tworzenie stron www
                        </Link>
                        <Link 
                          to="/sklepy-internetowe" 
                          className={`${linkClass} ${isActive('/sklepy-internetowe') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/sklepy-internetowe') ? 'page' : undefined}
                        >
                          Sklepy internetowe
                        </Link>
                        
                        <p className={`font-medium mt-4 mb-1 px-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Pozycjonowanie (SEO)</p>
                        <Link 
                          to="/pozycjonowanie-stron" 
                          className={`${linkClass} ${isActive('/pozycjonowanie-stron') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/pozycjonowanie-stron') ? 'page' : undefined}
                        >
                          Pozycjonowanie stron
                        </Link>
                        <Link 
                          to="/pozycjonowanie-lokalne" 
                          className={`${linkClass} ${isActive('/pozycjonowanie-lokalne') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/pozycjonowanie-lokalne') ? 'page' : undefined}
                        >
                          Pozycjonowanie lokalne
                        </Link>
                        <Link 
                          to="/audyt-seo" 
                          className={`${linkClass} ${isActive('/audyt-seo') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/audyt-seo') ? 'page' : undefined}
                        >
                          Audyt SEO
                        </Link>
                        <Link 
                          to="/optymalizacja-seo" 
                          className={`${linkClass} ${isActive('/optymalizacja-seo') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/optymalizacja-seo') ? 'page' : undefined}
                        >
                          Optymalizacja SEO
                        </Link>
                        <Link 
                          to="/copywriting-seo" 
                          className={`${linkClass} ${isActive('/copywriting-seo') ? 'font-bold' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive('/copywriting-seo') ? 'page' : undefined}
                        >
                          Copywriting SEO
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Link 
                  to="/projects" 
                  className={`${linkClass} ${isActive('/projects') ? 'font-bold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive('/projects') ? 'page' : undefined}
                >
                  Portfolio
                </Link>
                
                <Link 
                  to="/about" 
                  className={`${linkClass} ${isActive('/about') ? 'font-bold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  O nas
                </Link>
                
                <Link 
                  to="/blog" 
                  className={`${linkClass} ${isActive('/blog') ? 'font-bold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive('/blog') ? 'page' : undefined}
                >
                  Blog
                </Link>
                
                <Link 
                  to="/contact" 
                  className={`${linkClass} ${isActive('/contact') ? 'font-bold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive('/contact') ? 'page' : undefined}
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
