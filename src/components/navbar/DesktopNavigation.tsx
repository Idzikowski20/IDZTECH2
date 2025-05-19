
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

  const activeClass = 'bg-gray-100 text-black';

  const linkClass = cn(
    "transition-colors duration-300 px-3 py-2 rounded-md",
    theme === 'light'
      ? 'text-black hover:bg-gray-100 hover:text-black'
      : 'text-white hover:bg-white/10 hover:text-white'
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden lg:flex items-center gap-[10] justify-center w-full max-w-5xl">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="space-x-1">
          <NavigationMenuItem>
            <Link to="/" className={cn(linkClass, isActive('/') && activeClass)}>
              Start
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                'transition-colors duration-300',
                theme === 'light'
                  ? 'text-black hover:bg-gray-100 hover:text-black'
                  : 'text-white hover:bg-white/10 hover:text-white'
              )}
            >
              Usługi
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[650px] grid-cols-2 gap-3 p-6 bg-white dark:bg-black/80">
                <div>
                  <h3 className={cn('font-medium mb-3 px-3', theme === 'light' ? 'text-black' : 'text-white')}>
                    Strony www
                  </h3>
                  <ul className="space-y-1">
                    {[
                      { path: '/tworzenie-stron-www', label: 'Tworzenie stron www', desc: 'Tworzenie stron www' },
                      { path: '/sklepy-internetowe', label: 'Tworzenie sklepów internetowych', desc: 'Tworzenie sklepów internetowych' },
                    ].map(item => (
                      <li key={item.path}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                              theme === 'light'
                                ? isActive(item.path)
                                  ? 'bg-gray-500 text-black'
                                  : 'hover:bg-gray-500 text-black'
                                : isActive(item.path)
                                  ? 'bg-gray-500 text-black'
                                  : 'hover:bg-gray-500 text-white'
                            )}
                          >
                            <div className={cn('text-sm font-medium leading-none', theme === 'light' ? 'text-black' : 'text-white')}>
                              {item.label}
                            </div>
                            <p className={cn('line-clamp-2 text-sm leading-snug', theme === 'light' ? 'text-gray-600' : 'text-gray-400')}>
                              {item.desc}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className={cn('font-medium mb-3 px-3', theme === 'light' ? 'text-black' : 'text-white')}>
                    Pozycjonowanie (SEO)
                  </h3>
                  <ul className="space-y-1">
                    {[
                      { path: '/pozycjonowanie-stron', label: 'Pozycjonowanie stron internetowych', desc: 'Pozycjonowanie stron internetowych' },
                      { path: '/pozycjonowanie-lokalne', label: 'Pozycjonowanie lokalne', desc: 'Pozycjonowanie lokalne' },
                      { path: '/audyt-seo', label: 'Audyt SEO', desc: 'Audyt SEO' },
                      { path: '/optymalizacja-seo', label: 'Optymalizacja SEO', desc: 'Optymalizacja SEO' },
                      { path: '/copywriting-seo', label: 'Copywriting SEO', desc: 'Copywriting SEO' },
                      { path: '/content-plan', label: 'Content Plan', desc: 'Content Plan' }
                    ].map(item => (
                      <li key={item.path}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                              theme === 'light'
                                ? isActive(item.path)
                                  ? 'bg-gray-100 text-black'
                                  : 'hover:bg-gray-100 text-black'
                                : isActive(item.path)
                                  ? 'bg-gray-500 text-black'
                                  : 'hover:bg-gray-500 text-white'
                            )}
                          >
                            <div className={cn('text-sm font-medium leading-none', theme === 'light' ? 'text-black' : 'text-white')}>
                              {item.label}
                            </div>
                            <p className={cn('line-clamp-2 text-sm leading-snug', theme === 'light' ? 'text-gray-600' : 'text-gray-400')}>
                              {item.desc}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                'transition-colors duration-300',
                theme === 'light'
                  ? 'text-black hover:bg-gray-100 hover:text-black'
                  : 'text-white hover:bg-white/10 hover:text-white'
              )}
            >
              Narzędzia
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[280px] p-4 bg-white dark:bg-black/80">
                <ul className="space-y-2">
                  {[
                    { path: '/password-generator', label: 'Generator haseł' },
                    { path: '/privacy-policy-generator', label: 'Generator polityki prywatności' },
                    { path: '/domain-creator', label: 'Kreator nazwy domeny' }
                  ].map(item => (
                    <li key={item.path}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors',
                            theme === 'light'
                              ? isActive(item.path)
                                ? 'bg-gray-100 text-black'
                                : 'hover:bg-gray-100 text-black'
                              : isActive(item.path)
                                ? 'bg-gray-500 text-black'
                                : 'hover:bg-gray-500 text-white'
                          )}
                        >
                          <div className={cn('text-sm font-medium', theme === 'light' ? 'text-black' : 'text-white')}>
                            {item.label}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/projects" className={cn(linkClass, isActive('/projects') && activeClass)}>
              Portfolio
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/about" className={cn(linkClass, isActive('/about') && activeClass)}>
              O nas
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/blog" className={cn(linkClass, isActive('/blog') && activeClass)}>
              Blog
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;

// TypeScript interface for the NavigationMenuLink component
interface NavigationMenuLinkProps {
  asChild?: boolean;
  children: React.ReactNode;
}

const NavigationMenuLink: React.FC<NavigationMenuLinkProps> = ({ asChild, children }) => {
  return <>{children}</>;
};
