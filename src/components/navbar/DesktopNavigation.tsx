
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import { trackEvent } from '@/utils/analytics';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const DesktopNavigation = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isCurrentPath = (path: string) => path === pathname;
  
  // Services links configuration
  const serviceLinks = {
    web: [
      { title: "Tworzenie stron www", href: "/tworzenie-stron-www" },
      { title: "Tworzenie sklepów internetowych", href: "/sklepy-internetowe" }
    ],
    seo: [
      { title: "Pozycjonowanie stron internetowych", href: "/pozycjonowanie-stron" },
      { title: "Pozycjonowanie lokalne", href: "/pozycjonowanie-lokalne" },
      { title: "Audyt SEO", href: "/audyt-seo" },
      { title: "Optymalizacja SEO", href: "/optymalizacja-seo" },
      { title: "Copywriting SEO", href: "/copywriting-seo" },
      { title: "Content Plan", href: "/content-plan" }
    ]
  };

  // Tools links
  const toolLinks = [
    { title: "Generator haseł", href: "/password-generator" },
    { title: "Generator polityki prywatności", href: "/privacy-policy-generator" },
    { title: "Kreator nazwy domeny", href: "/domain-creator" }
  ];

  const linkClass = (isActive: boolean) => {
    return `text-sm flex items-center hover:text-purple-400 transition-colors py-2 px-3 rounded-md ${
      isActive 
        ? theme === 'light' 
          ? 'font-bold text-premium-purple' 
          : 'font-bold text-premium-purple'
        : theme === 'light'
          ? 'text-black'
          : 'text-gray-200'
    }`;
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link 
            to="/" 
            className={linkClass(isCurrentPath('/'))}
            onClick={() => trackEvent('navigation_click', 'menu', 'home')}
          >
            Start
          </Link>
        </NavigationMenuItem>
        
        {/* Usługi dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={`${linkClass(
              ['/tworzenie-stron-www', '/sklepy-internetowe', '/pozycjonowanie-stron', 
               '/pozycjonowanie-lokalne', '/audyt-seo', '/optymalizacja-seo', 
               '/copywriting-seo', '/content-plan'].includes(pathname)
            )}`}
            onClick={() => setOpenMenu(openMenu === 'services' ? null : 'services')}
            data-state={openMenu === 'services' ? 'open' : 'closed'}
          >
            Usługi
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[600px] grid grid-cols-2 gap-2 p-4">
              <div>
                <h3 className="font-medium mb-2 px-3">Strony www</h3>
                <ul className="space-y-1">
                  {serviceLinks.web.map((link) => (
                    <li key={link.href}>
                      <Link 
                        to={link.href} 
                        className={`block px-3 py-2 rounded-md ${
                          isCurrentPath(link.href) 
                            ? 'bg-premium-light/10 font-medium text-premium-purple'
                            : theme === 'light'
                              ? 'hover:text-black transition-colors'
                              : 'hover:text-white transition-colors'
                        }`}
                        onClick={() => {
                          setOpenMenu(null);
                          trackEvent('navigation_click', 'services_menu', link.title);
                        }}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2 px-3">Pozycjonowanie (SEO)</h3>
                <ul className="space-y-1">
                  {serviceLinks.seo.map((link) => (
                    <li key={link.href}>
                      <Link 
                        to={link.href} 
                        className={`block px-3 py-2 rounded-md ${
                          isCurrentPath(link.href) 
                            ? 'bg-premium-light/10 font-medium text-premium-purple'
                            : theme === 'light'
                              ? 'hover:text-black transition-colors'
                              : 'hover:text-white transition-colors'
                        }`}
                        onClick={() => {
                          setOpenMenu(null);
                          trackEvent('navigation_click', 'services_menu', link.title);
                        }}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Narzędzia dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={`${linkClass(
              ['/password-generator', '/privacy-policy-generator', '/domain-creator'].includes(pathname)
            )}`}
            onClick={() => setOpenMenu(openMenu === 'tools' ? null : 'tools')}
            data-state={openMenu === 'tools' ? 'open' : 'closed'}
          >
            Narzędzia
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[220px] p-4 space-y-1">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className={`block px-3 py-2 rounded-md ${
                      isCurrentPath(link.href) 
                        ? 'bg-premium-light/10 font-medium text-premium-purple'
                        : theme === 'light'
                          ? 'hover:text-black transition-colors'
                          : 'hover:text-white transition-colors'
                    }`}
                    onClick={() => {
                      setOpenMenu(null);
                      trackEvent('navigation_click', 'tools_menu', link.title);
                    }}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link 
            to="/projects" 
            className={linkClass(isCurrentPath('/projects'))}
            onClick={() => trackEvent('navigation_click', 'menu', 'portfolio')}
          >
            Portfolio
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link 
            to="/about" 
            className={linkClass(isCurrentPath('/about'))}
            onClick={() => trackEvent('navigation_click', 'menu', 'about')}
          >
            O nas
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link 
            to="/blog" 
            className={linkClass(isCurrentPath('/blog'))}
            onClick={() => trackEvent('navigation_click', 'menu', 'blog')}
          >
            Blog
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link 
            to="/contact" 
            className={linkClass(isCurrentPath('/contact'))}
            onClick={() => trackEvent('navigation_click', 'menu', 'contact')}
          >
            Kontakt
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
