
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/utils/themeContext';

const DesktopNavigation = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  const linkClass = cn(
    "transition-transform duration-300 hover:scale-110 px-4 py-2 rounded-md",
    theme === 'light' ? 'text-black hover:text-black' : 'text-white hover:text-white'
  );
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="hidden lg:flex items-center gap-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className={`${linkClass} ${isActive('/') ? 'font-bold' : ''}`}>Strona główna</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className={`transition-transform duration-300 hover:scale-110 ${theme === 'light' ? 'text-black hover:bg-transparent hover:text-black' : 'text-white hover:bg-transparent hover:text-white'}`}>
              Usługi
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-black/80">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/tworzenie-stron-www" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/tworzenie-stron-www') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Strony WWW</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Tworzenie responsywnych stron internetowych
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/sklepy-internetowe" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/sklepy-internetowe') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Sklepy Internetowe</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Tworzenie sklepów e-commerce
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/pozycjonowanie-stron" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/pozycjonowanie-stron') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Pozycjonowanie SEO</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Zwiększanie widoczności w wyszukiwarkach
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/pozycjonowanie-lokalne" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/pozycjonowanie-lokalne') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Pozycjonowanie Lokalne</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Zwiększanie widoczności w lokalnych wynikach
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/audyt-seo" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/audyt-seo') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Audyt SEO</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Kompleksowa analiza strony pod kątem SEO
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/optymalizacja-seo" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/optymalizacja-seo') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Optymalizacja SEO</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Optymalizacja techniczna strony
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/copywriting-seo" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/copywriting-seo') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Copywriting SEO</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Tworzenie treści zoptymalizowanych pod SEO
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/content-plan" 
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 ${isActive('/content-plan') ? 'bg-white/20' : ''}`}
                    >
                      <div className="text-white text-sm font-medium leading-none">Content Plan</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Strategia tworzenia i publikacji treści
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/projects" className={`${linkClass} ${isActive('/projects') ? 'font-bold' : ''}`}>Portfolio</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/about" className={`${linkClass} ${isActive('/about') ? 'font-bold' : ''}`}>O nas</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/blog" className={`${linkClass} ${isActive('/blog') ? 'font-bold' : ''}`}>Blog</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/contact" className={`${linkClass} ${isActive('/contact') ? 'font-bold' : ''}`}>Kontakt</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;
