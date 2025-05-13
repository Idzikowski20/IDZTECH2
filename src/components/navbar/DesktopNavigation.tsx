import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/utils/themeContext';

const DesktopNavigation = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  const linkClass = cn(
    "transition-colors duration-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-purple",
    theme === 'light' ? 'text-black hover:bg-gray-100 hover:text-black' : 'text-white hover:bg-white/10 hover:text-white'
  );
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="hidden lg:flex items-center gap-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link 
              to="/" 
              className={`${linkClass} ${isActive('/') ? 'font-bold' : ''}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Start
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger 
              className={`transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-purple ${theme === 'light' ? 'text-black hover:bg-gray-100 hover:text-black' : 'text-white hover:bg-white/10 hover:text-white'}`}
              aria-label="Menu usług"
            >
              Usługi
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] grid-cols-2 gap-3 p-4 bg-white dark:bg-black/80">
                <div>
                  <h3 className={`font-medium mb-2 px-3 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Strony www</h3>
                  <ul>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/tworzenie-stron-www" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/tworzenie-stron-www') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/tworzenie-stron-www') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Tworzenie stron www
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Projektujemy i tworzymy profesjonalne strony internetowe
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/sklepy-internetowe" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/sklepy-internetowe') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/sklepy-internetowe') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Tworzenie sklepów internetowych
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Kompleksowe rozwiązania e-commerce
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className={`font-medium mb-2 px-3 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Pozycjonowanie (SEO)</h3>
                  <ul>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/pozycjonowanie-stron" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/pozycjonowanie-stron') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/pozycjonowanie-stron') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Pozycjonowanie stron internetowych
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Zwiększanie widoczności w wyszukiwarkach
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/pozycjonowanie-lokalne" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/pozycjonowanie-lokalne') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/pozycjonowanie-lokalne') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Pozycjonowanie lokalne
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Zwiększanie widoczności w lokalnych wynikach
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/audyt-seo" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/audyt-seo') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/audyt-seo') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Audyt SEO
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Analiza strony pod kątem SEO
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/optymalizacja-seo" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/optymalizacja-seo') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/optymalizacja-seo') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Optymalizacja SEO
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Optymalizacja techniczna strony
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/copywriting-seo" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/copywriting-seo') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/copywriting-seo') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Copywriting SEO
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Tworzenie treści pod SEO
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/content-plan" 
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/10 text-white'} ${isActive('/content-plan') ? theme === 'light' ? 'bg-gray-100' : 'bg-white/20' : ''}`}
                          aria-current={isActive('/content-plan') ? 'page' : undefined}
                        >
                          <div className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            Content Plan
                          </div>
                          <p className={`line-clamp-2 text-sm leading-snug ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                            Strategia tworzenia treści
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link 
              to="/projects" 
              className={`${linkClass} ${isActive('/projects') ? 'font-bold' : ''}`}
              aria-current={isActive('/projects') ? 'page' : undefined}
            >
              Portfolio
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link 
              to="/about" 
              className={`${linkClass} ${isActive('/about') ? 'font-bold' : ''}`}
              aria-current={isActive('/about') ? 'page' : undefined}
            >
              O nas
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link 
              to="/blog" 
              className={`${linkClass} ${isActive('/blog') ? 'font-bold' : ''}`}
              aria-current={isActive('/blog') ? 'page' : undefined}
            >
              Blog
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link 
              to="/contact" 
              className={`${linkClass} ${isActive('/contact') ? 'font-bold' : ''}`}
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              Kontakt
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;

// TypeScript interface for the NavigationMenuLink component
// This is needed because we're using the NavigationMenuLink in this file
interface NavigationMenuLinkProps {
  asChild?: boolean;
  children: React.ReactNode;
}

const NavigationMenuLink: React.FC<NavigationMenuLinkProps> = ({ asChild, children }) => {
  return <>{children}</>;
};
