
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
import { useTranslation } from 'react-i18next';

const DesktopNavigation = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { t } = useTranslation();

  const activeClass = 'bg-gray-100 text-black';

  const linkClass = cn(
    "transition-colors duration-300 px-4 py-2 rounded-md",
    theme === 'light'
      ? 'text-black hover:bg-gray-100 hover:text-black'
      : 'text-white hover:bg-white/10 hover:text-white'
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden lg:flex items-center gap-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className={cn(linkClass, isActive('/') && activeClass)}>
              {t('navigation.start')}
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
              {t('navigation.services')}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 gap-3 p-4 bg-white dark:bg-black/80">
              <div>
                <h3 className={cn('font-medium mb-2 px-3', theme === 'light' ? 'text-black' : 'text-white')}>
                  {t('websiteTypes.websites')}
                </h3>
                <ul>
                  {[
                    { path: '/tworzenie-stron-www', label: t('websiteTypes.webDevelopment'), desc: 'Projektujemy i tworzymy profesjonalne strony internetowe' },
                    { path: '/sklepy-internetowe', label: t('websiteTypes.eCommerce'), desc: 'Kompleksowe rozwiązania e-commerce' },
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
                                ? 'bg-gray-700 text-black'
                                : 'hover:bg-gray-700 text-white'
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
                <h3 className={cn('font-medium mb-2 px-3', theme === 'light' ? 'text-black' : 'text-white')}>
                  {t('seo.title')}
                </h3>
                <ul>
                  {[
                    { path: '/pozycjonowanie-stron', label: t('seo.seoServices'), desc: 'Zwiększanie widoczności w wyszukiwarkach' },
                    { path: '/pozycjonowanie-lokalne', label: t('seo.localSeo'), desc: 'Zwiększanie widoczności w lokalnych wynikach' },
                    { path: '/audyt-seo', label: t('seo.seoAudit'), desc: 'Analiza strony pod kątem SEO' },
                    { path: '/optymalizacja-seo', label: t('seo.seoOptimization'), desc: 'Optymalizacja techniczna strony' },
                    { path: '/copywriting-seo', label: t('seo.seoCopywriting'), desc: 'Tworzenie treści pod SEO' },
                    { path: '/content-plan', label: t('seo.contentPlan'), desc: 'Strategia tworzenia treści' }
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
                                ? 'bg-gray-700 text-black'
                                : 'hover:bg-gray-700 text-white'
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
              {t('navigation.tools')}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-2 bg-white dark:bg-black/80">
                <ul>
                  {[
                    { path: '/password-generator', label: t('tools.passwordGenerator') },
                    { path: '/privacy-policy-generator', label: t('tools.privacyPolicyGenerator') },
                    { path: '/domain-creator', label: t('tools.domainCreator') }
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
                                ? 'bg-gray-700 text-black'
                                : 'hover:bg-gray-700 text-white'
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
              {t('navigation.portfolio')}
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/about" className={cn(linkClass, isActive('/about') && activeClass)}>
              {t('navigation.about')}
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/blog" className={cn(linkClass, isActive('/blog') && activeClass)}>
              {t('navigation.blog')}
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/contact" className={cn(linkClass, isActive('/contact') && activeClass)}>
              {t('navigation.contact')}
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
