
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Brand from './Brand';
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import DesktopControls from './DesktopControls';
import { useAuth } from '@/utils/AuthProvider';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/utils/themeContext';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Strona główna',
    href: '/',
  },
  {
    id: 'services',
    label: 'Usługi',
    href: '/services',
    children: [
      {
        id: 'seo',
        label: 'SEO',
        href: '/seo',
      },
      {
        id: 'web-development',
        label: 'Tworzenie Stron',
        href: '/web-development',
      },
      {
        id: 'content',
        label: 'Copywriting',
        href: '/seo-copywriting',
      },
      {
        id: 'audit',
        label: 'Audyt SEO',
        href: '/seo-audit',
      },
    ],
  },
  {
    id: 'contact',
    label: 'Kontakt',
    href: '/contact',
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
  },
  {
    id: 'about',
    label: 'O nas',
    href: '/about',
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed w-full top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-premium-light/10 py-2'
          : 'bg-transparent py-4'
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Brand />

        {/* Desktop Navigation */}
        <DesktopNavigation navigationItems={navigationItems} />

        {/* Controls (Login/Register buttons, notification bell) */}
        <DesktopControls />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-premium-light hover:bg-black hover:text-white"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Menu */}
        <MobileMenu
          navigationItems={navigationItems}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </nav>
    </header>
  );
};

export default Navbar;
