
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/auth';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import BlinkingUnderscore from './BlinkingUnderscore';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    isAuthenticated
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-premium-dark/80 backdrop-blur-md shadow-lg dark:bg-premium-light/80' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-white font-bold text-xl dark:text-premium-dark">
          <img src="/lovable-uploads/14354e6c-0dfa-410a-86da-d56b37d05fd2.png" alt="IDZ.TECH" className="h-8 mr-2" />
          <span className="flex items-center">
            IDZ.TECH<BlinkingUnderscore />
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-colors dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark ${location.pathname === "/" ? "text-premium-purple" : ""}`}>Start</Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-black dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark bg-transparent">Oferta</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
                    <div className="space-y-2">
                      <h3 className="font-medium">Strony www</h3>
                      <Link to="/tworzenie-stron-www" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Tworzenie stron www
                      </Link>
                      <Link to="/tworzenie-sklepow-internetowych" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Tworzenie sklepów internetowych
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Pozycjonowanie (SEO)</h3>
                      <Link to="/pozycjonowanie-stron-internetowych" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Pozycjonowanie stron internetowych
                      </Link>
                      <Link to="/pozycjonowanie-lokalne" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Pozycjonowanie lokalne
                      </Link>
                      <Link to="/audyt-seo" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Audyt SEO
                      </Link>
                      <Link to="/optymalizacja-seo" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Optymalizacja SEO
                      </Link>
                      <Link to="/copywriting-seo" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Copywriting SEO
                      </Link>
                      <Link to="/content-plan" className="block p-2 hover:bg-slate-100 hover:text-black rounded dark:hover:bg-premium-dark dark:hover:text-white">
                        Content Plan
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="/projects" className={`text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-colors dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark ${location.pathname === "/projects" ? "text-premium-purple" : ""}`}>Portfolio</Link>
          <Link to="/about-us" className={`text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-colors dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark ${location.pathname === "/about-us" ? "text-premium-purple" : ""}`}>O nas</Link>
          
          <Link to="/blog" className={`text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-colors dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark ${location.pathname.includes("/blog") ? "text-premium-purple" : ""}`}>
            Blog
          </Link>
          
          <Link to="/contact" className={`text-white hover:text-black hover:bg-white px-3 py-2 rounded transition-colors dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark ${location.pathname === "/contact" ? "text-premium-purple" : ""}`}>Kontakt</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
          trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
        }} className="text-white hover:bg-white hover:text-black dark:text-premium-dark dark:hover:bg-premium-dark dark:hover:text-white">
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Link to="/contact" className="hidden md:block">
            <Button className="bg-black text-white hover:text-black hover:bg-white dark:bg-white dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark">
              Umów spotkanie
            </Button>
          </Link>
          
          {isAuthenticated ? <Link to="/admin">
              <Button variant="secondary" size="sm" className="hover:bg-white hover:text-black dark:hover:bg-premium-dark dark:hover:text-white">
                Admin
              </Button>
            </Link> : <Link to="/login">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:text-black dark:text-premium-dark dark:hover:bg-premium-dark dark:hover:text-white">
                <LogIn className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Zaloguj</span>
              </Button>
            </Link>}
        </div>
      </div>
    </nav>;
};

export default Navbar;
