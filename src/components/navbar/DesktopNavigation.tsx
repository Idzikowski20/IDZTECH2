
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
              {t('navigation.start')}
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                'transition-colors duration-300',
                theme === 'light'
                  ? 'text-black hover:bg-gray-500 hover:text-black'
                  : 'text-white hover:bg-white/10 hover:text-white'
              )}
            >
              {t('navigation.services')}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[650px] grid-cols-2 gap-3 p-6 bg-white dark:bg-black/80">
                <div>
                  <h3 className={cn('font-medium mb-3 px-3', theme === 'light' ? 'text-black' : 'text-white')}>
                    {t('websiteTypes.websites')}
                  </h3>
                  <ul className="space-y-1">
                    {[
                      { path: '/tworzenie-stron-www', label: t('websiteTypes.webDevelopment'), desc: t('websiteTypes.webDevelopment') },
                      { path: '/sklepy-internetowe', label: t('websiteTypes.eCommerce'), desc: t('websiteTypes.eCommerce') },
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
                    {t('seo.title')}
                  </h3>
                  <ul className="space-y-1">
                    {[
                      { path: '/pozycjonowanie-stron', label: t('seo.seoServices'), desc: t('seo.seoServices') },
                      { path: '/pozycjonowanie-lokalne', label: t('seo.localSeo'), desc: t('seo.localSeo') },
                      { path: '/audyt-seo', label: t('seo.seoAudit'), desc: t('seo.seoAudit') },
                      { path: '/optymalizacja-seo', label: t('seo.seoOptimization'), desc: t('seo.seoOptimization') },
                      { path: '/copywriting-seo', label: t('seo.seoCopywriting'), desc: t('seo.seoCopywriting') },
                      { path: '/content-plan', label: t('seo.contentPlan'), desc: t('seo.contentPlan') }
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
              {t('navigation.tools')}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[280px] p-4 bg-white dark:bg-black/80">
                <ul className="space-y-2">
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

          {/* <NavigationMenuItem>
              <Link to="/contact" className="rounded-2xl bg-sky-50 text-white hover:bg-black hover:text-white transition-colors md:block">
                  Kontakt
              </Link>
          </NavigationMenuItem> */}
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
