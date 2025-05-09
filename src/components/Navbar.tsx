
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Strona główna', href: '/' },
    { 
      label: 'Usługi', 
      href: '#services',
      submenu: [
        { label: 'Tworzenie stron WWW', href: '/tworzenie-stron-www' },
        { label: 'Marketing w Google', href: '#marketing' },
        { label: 'Pozycjonowanie', href: '#seo' },
        { label: 'Media społecznościowe', href: '#social' },
      ]
    },
    { label: 'O nas', href: '#about' },
    { label: 'Realizacje', href: '#projects' },
    { label: 'Kontakt', href: '#contact' },
  ];

  const toggleSubmenu = (index: number) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300", 
        scrolled ? "bg-premium-dark/90 backdrop-blur-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50">
          <div className="h-8 w-8 rounded-full bg-premium-gradient"></div>
          <span className="text-xl font-bold">Premium Digital</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
              {item.submenu ? (
                <>
                  <button 
                    onClick={() => toggleSubmenu(index)}
                    className={cn(
                      "text-premium-light/80 hover:text-premium-light transition-colors flex items-center gap-1"
                    )}
                  >
                    {item.label}
                    <ChevronDown size={16} className={cn(
                      "transition-transform",
                      activeSubmenu === index ? "rotate-180" : ""
                    )} />
                  </button>
                  
                  <div className={cn(
                    "absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-premium-dark/90 backdrop-blur-sm transition-all",
                    activeSubmenu === index ? "block" : "hidden"
                  )}>
                    <div className="py-1">
                      {item.submenu.map((subitem, subindex) => (
                        subitem.href.startsWith('/') ? (
                          <Link
                            key={subindex}
                            to={subitem.href}
                            className="block px-4 py-2 text-sm text-premium-light/80 hover:text-premium-light hover:bg-premium-purple/20 transition-colors"
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {subitem.label}
                          </Link>
                        ) : (
                          <a
                            key={subindex}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-premium-light/80 hover:text-premium-light hover:bg-premium-purple/20 transition-colors"
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {subitem.label}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                item.href.startsWith('/') ? (
                  <Link 
                    to={item.href} 
                    className="text-premium-light/80 hover:text-premium-light transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a 
                    href={item.href} 
                    className="text-premium-light/80 hover:text-premium-light transition-colors"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          variant="default" 
          className="hidden lg:block bg-premium-gradient hover:opacity-90 transition-opacity"
        >
          Darmowa wycena
        </Button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex items-center text-premium-light relative z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-premium-dark/98 backdrop-blur-sm flex flex-col justify-center items-center transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center space-y-6 w-full px-8">
          {menuItems.map((item, index) => (
            <div key={index} className="w-full text-center">
              {item.submenu ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="text-xl font-medium text-premium-light/80 hover:text-premium-light transition-colors flex items-center gap-1"
                  >
                    {item.label}
                    <ChevronDown size={16} className={cn(
                      "transition-transform",
                      activeSubmenu === index ? "rotate-180" : ""
                    )} />
                  </button>
                  
                  {activeSubmenu === index && (
                    <div className="mt-4 space-y-2 w-full">
                      {item.submenu.map((subitem, subindex) => (
                        <div key={subindex} className="w-full">
                          {subitem.href.startsWith('/') ? (
                            <Link
                              to={subitem.href}
                              onClick={() => {
                                setActiveSubmenu(null);
                                setIsOpen(false);
                              }}
                              className="block text-sm text-premium-light/70 hover:text-premium-light transition-colors py-1"
                            >
                              {subitem.label}
                            </Link>
                          ) : (
                            <a
                              href={subitem.href}
                              onClick={() => {
                                setActiveSubmenu(null);
                                setIsOpen(false);
                              }}
                              className="block text-sm text-premium-light/70 hover:text-premium-light transition-colors py-1"
                            >
                              {subitem.label}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                item.href.startsWith('/') ? (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium text-premium-light/80 hover:text-premium-light transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium text-premium-light/80 hover:text-premium-light transition-colors"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          ))}
          <Button 
            variant="default" 
            className="mt-6 w-full max-w-xs bg-premium-gradient hover:opacity-90 transition-opacity"
          >
            Darmowa wycena
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
