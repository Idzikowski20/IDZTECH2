
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn, Menu } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import BlinkingUnderscore from './BlinkingUnderscore';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    theme,
    toggleDarkMode
  } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect to disable body scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  const handleMenuOpen = (open: boolean) => {
    setIsMenuOpen(open);
  };
  
  const DesktopNavigation = () => (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/" ? "text-premium-purple" : ""}`}>Start</Link>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-slate-50 bg-transparent">Oferta</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
                <div className="space-y-2">
                  <h3 className="font-medium">Strony www</h3>
                  <Link to="/tworzenie-stron-www" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Tworzenie stron www
                  </Link>
                  <Link to="/tworzenie-sklepow-internetowych" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Tworzenie sklepów internetowych
                  </Link>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Pozycjonowanie (SEO)</h3>
                  <Link to="/pozycjonowanie-stron-internetowych" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Pozycjonowanie stron internetowych
                  </Link>
                  <Link to="/pozycjonowanie-lokalne" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Pozycjonowanie lokalne
                  </Link>
                  <Link to="/audyt-seo" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Audyt SEO
                  </Link>
                  <Link to="/optymalizacja-seo" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Optymalizacja SEO
                  </Link>
                  <Link to="/copywriting-seo" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Copywriting SEO
                  </Link>
                  <Link to="/content-plan" className="block p-2 hover:bg-slate-100 hover:text-black rounded">
                    Content Plan
                  </Link>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <Link to="/projects" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/projects" ? "text-premium-purple" : ""}`}>Portfolio</Link>
      <Link to="/about-us" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/about-us" ? "text-premium-purple" : ""}`}>O nas</Link>
      
      <Link to="/blog" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname.includes("/blog") ? "text-premium-purple" : ""}`}>
        Blog
      </Link>
      
      <Link to="/contact" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/contact" ? "text-premium-purple" : ""}`}>Kontakt</Link>
    </div>
  );

  const MobileMenu = () => (
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
              
              <Link to={isAuthenticated ? "/admin" : "/login"} onClick={() => setIsMenuOpen(false)}>
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

          <nav className="flex-1 flex flex-col space-y-6">
            <Link to="/" 
              className={`text-white text-lg hover:bg-white/10 px-3 py-3 rounded-lg transition-colors ${location.pathname === "/" ? "bg-white/20" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Start
            </Link>
            
            <div className="space-y-2">
              <h3 className="text-white/70 text-sm font-semibold px-3">Strony www</h3>
              <Link to="/tworzenie-stron-www" 
                className={`text-white block hover:bg-white/10 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/tworzenie-stron-www" ? "bg-white/20" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tworzenie stron www
              </Link>
              <Link to="/tworzenie-sklepow-internetowych" 
                className={`text-white block hover:bg-white/10 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/tworzenie-sklepow-internetowych" ? "bg-white/20" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tworzenie sklepów internetowych
              </Link>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white/70 text-sm font-semibold px-3">Pozycjonowanie (SEO)</h3>
              <Link to="/pozycjonowanie-stron-internetowych" 
                className={`text-white block hover:bg-white/10 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/pozycjonowanie-stron-internetowych" ? "bg-white/20" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pozycjonowanie stron internetowych
              </Link>
              <Link to="/pozycjonowanie-lokalne" 
                className={`text-white block hover:bg-white/10 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/pozycjonowanie-lokalne" ? "bg-white/20" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pozycjonowanie lokalne
              </Link>
            </div>
            
            <Link to="/projects" 
              className={`text-white text-lg hover:bg-white/10 px-3 py-3 rounded-lg transition-colors ${location.pathname === "/projects" ? "bg-white/20" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            
            <Link to="/about-us" 
              className={`text-white text-lg hover:bg-white/10 px-3 py-3 rounded-lg transition-colors ${location.pathname === "/about-us" ? "bg-white/20" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              O nas
            </Link>
            
            <Link to="/blog" 
              className={`text-white text-lg hover:bg-white/10 px-3 py-3 rounded-lg transition-colors ${location.pathname.includes("/blog") ? "bg-white/20" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            <Link to="/contact" 
              className={`text-white text-lg hover:bg-white/10 px-3 py-3 rounded-lg transition-colors ${location.pathname === "/contact" ? "bg-white/20" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
          </nav>
          
          <Link to="/contact" className="mt-6" onClick={() => setIsMenuOpen(false)}>
            <Button className="w-full bg-black text-white hover:bg-white hover:text-black">
              Umów spotkanie
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-premium-dark/80 backdrop-blur-md shadow-lg' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-white font-bold text-xl">
          <span className="flex items-center">
            IDZ.TECH<BlinkingUnderscore />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNavigation />

        <div className="flex items-center space-x-4">
          {/* Desktop-only buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
            
            <Link to="/contact" className="hidden md:block">
              <Button className="bg-black text-white hover:bg-white hover:text-black">
                Umów spotkanie
              </Button>
            </Link>
            
            <Link to={isAuthenticated ? "/admin" : "/login"}>
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
          
          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
