
import React from 'react';
import { Link } from 'react-router-dom';
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
  
  const linkClass = cn(
    "transition-transform duration-300 hover:scale-110 px-4 py-2 rounded-md",
    theme === 'light' ? 'text-black hover:text-black' : 'text-white hover:text-white'
  );
  
  return (
    <div className="hidden lg:flex items-center gap-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className={linkClass}>Strona główna</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className={`transition-transform duration-300 hover:scale-110 ${theme === 'light' ? 'text-black hover:bg-transparent hover:text-black' : 'text-white hover:bg-transparent hover:text-white'}`}>
              Usługi
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-black/80">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/tworzenie-stron-www" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10">
                      <div className="text-white text-sm font-medium leading-none">Strony WWW</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Tworzenie responsywnych stron internetowych
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/sklepy-internetowe" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10">
                      <div className="text-white text-sm font-medium leading-none">Sklepy Internetowe</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Tworzenie sklepów e-commerce
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/pozycjonowanie-stron" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10">
                      <div className="text-white text-sm font-medium leading-none">Pozycjonowanie SEO</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Zwiększanie widoczności w wyszukiwarkach
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/kampanie-google-ads" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10">
                      <div className="text-white text-sm font-medium leading-none">Kampanie Google Ads</div>
                      <p className="line-clamp-2 text-sm leading-snug text-white/70">
                        Prowadzenie skutecznych kampanii reklamowych
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/portfolio" className={linkClass}>Portfolio</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/about" className={linkClass}>O nas</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/blog" className={linkClass}>Blog</Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/contact" className={linkClass}>Kontakt</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;
