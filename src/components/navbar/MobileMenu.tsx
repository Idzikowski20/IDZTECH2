
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import MobileNavigationItem from './MobileNavigationItem';
import MobileAccordionItem from './MobileAccordionItem';
import MobileMenuHeader from './MobileMenuHeader';
import MobileMenuFooter from './MobileMenuFooter';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { theme } = useTheme();
  const location = useLocation();
  
  // Handle menu opening/closing with more reliable state management
  const handleMenuOpen = (open: boolean) => {
    setIsMenuOpen(open);
    
    // When opening menu, prevent body scroll
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Close menu when route changes
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  }, [location.pathname, setIsMenuOpen, isMenuOpen]);
  
  // Clean up body scroll style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle navigation click to close the menu
  const handleNavigation = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Define offer categories and items
  const offerCategories = [
    {
      title: "Strony www",
      items: [
        { path: "/tworzenie-stron-www", label: "Tworzenie stron www" },
        { path: "/sklepy-internetowe", label: "Tworzenie sklepów internetowych" }
      ]
    },
    {
      title: "Pozycjonowanie (SEO)",
      items: [
        { path: "/pozycjonowanie-stron", label: "Pozycjonowanie stron internetowych" },
        { path: "/pozycjonowanie-lokalne", label: "Pozycjonowanie lokalne" },
        { path: "/audyt-seo", label: "Audyt SEO" },
        { path: "/optymalizacja-seo", label: "Optymalizacja SEO" },
        { path: "/copywriting-seo", label: "Copywriting SEO" },
        { path: "/content-plan", label: "Content Plan" }
      ]
    }
  ];

  return (
    <Drawer open={isMenuOpen} onOpenChange={handleMenuOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`md:hidden ${theme === 'light' ? 'text-black hover:bg-gray-100 hover:text-black' : 'text-white hover:bg-gray-800 hover:text-white'}`}
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className={`h-[85vh] neo-blur ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-md border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
        <div className="px-6 py-8 flex flex-col h-full">
          <MobileMenuHeader onClose={handleNavigation} />

          <ScrollArea className="flex-1 overflow-hidden pr-2">
            <nav className="flex flex-col space-y-2">
              <MobileNavigationItem 
                to="/" 
                label="Start" 
                onClick={handleNavigation} 
              />
              
              <Accordion type="single" collapsible className="w-full">
                <MobileAccordionItem 
                  value="offer"
                  title="Oferta"
                  categories={offerCategories}
                  onClick={handleNavigation}
                />
              </Accordion>
              
              <MobileNavigationItem 
                to="/projects" 
                label="Portfolio" 
                onClick={handleNavigation} 
              />
              
              <MobileNavigationItem 
                to="/about" 
                label="O nas" 
                onClick={handleNavigation} 
              />
              
              <MobileNavigationItem 
                to="/blog" 
                label="Blog" 
                onClick={handleNavigation} 
              />
              
              <MobileNavigationItem 
                to="/contact" 
                label="Kontakt" 
                onClick={handleNavigation} 
              />
            </nav>
          </ScrollArea>
          
          <MobileMenuFooter onClose={handleNavigation} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
