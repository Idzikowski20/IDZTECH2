import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add click outside handler for services menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isServicesOpen && servicesRef.current && !servicesRef.current.contains(event.target as Node) && servicesButtonRef.current && !servicesButtonRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesOpen]);
  const menuItems = [{
    label: 'Strona główna',
    href: '/'
  }, {
    label: 'Usługi',
    href: '#services',
    submenu: true
  }, {
    label: 'O nas',
    href: '#about'
  }, {
    label: 'Realizacje',
    href: '#projects'
  }, {
    label: 'Kontakt',
    href: '#contact'
  }];
  const servicesCategories = [{
    title: 'Strony www',
    links: [{
      label: 'Tworzenie stron www',
      href: '/tworzenie-stron-www'
    }, {
      label: 'Tworzenie sklepów internetowych',
      href: '/tworzenie-sklepow-internetowych'
    }]
  }, {
    title: 'Pozycjonowanie (SEO)',
    links: [{
      label: 'Pozycjonowanie stron internetowych',
      href: '/pozycjonowanie-stron-internetowych'
    }, {
      label: 'Pozycjonowanie lokalne',
      href: '/pozycjonowanie-lokalne'
    }, {
      label: 'Audyt SEO',
      href: '/audyt-seo'
    }, {
      label: 'Optymalizacja SEO',
      href: '/optymalizacja-seo'
    }, {
      label: 'Copywriting SEO',
      href: '/copywriting-seo'
    }, {
      label: 'Content Plan',
      href: '/content-plan'
    }]
  }, {
    title: 'SEM - PPC',
    links: [{
      label: 'Kampanie Google ads',
      href: '#google-ads'
    }, {
      label: 'Kampanie Meta Ads',
      href: '#meta-ads'
    }, {
      label: 'Audyt Google Ads',
      href: '#google-ads-audit'
    }]
  }, {
    title: 'Inne Usługi',
    links: [{
      label: 'Marketing lokalny',
      href: '#local-marketing'
    }, {
      label: 'Email Marketing',
      href: '#email-marketing'
    }, {
      label: 'Filmy Reklamowe',
      href: '#video-ads'
    }, {
      label: 'Content Marketing',
      href: '#content-marketing'
    }]
  }];

  // Mouse enter/leave handlers for hover functionality
  const handleMouseEnter = () => {
    setIsServicesOpen(true);
  };
  const handleMouseLeave = () => {
    setIsServicesOpen(false);
  };

  // Function to handle mobile submenu toggles
  const toggleMobileSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };
  return <nav className={cn("fixed top-0 w-full z-50 transition-all duration-300", scrolled ? "bg-premium-dark/90 py-4" : "bg-transparent py-6")}>
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50">
          <div className="h-8 w-8 rounded-full bg-premium-gradient"></div>
          <span className="text-xl font-bold">IDZ.TECH</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, index) => <div key={index} className="relative">
              {item.submenu ? <div ref={servicesButtonRef} onMouseEnter={handleMouseEnter} className="text-premium-light/80 hover:text-premium-light transition-colors flex items-center gap-1 cursor-pointer">
                  {item.label}
                  <ChevronDown size={16} className={cn("transition-transform", isServicesOpen ? "rotate-180" : "")} />
                </div> : item.href.startsWith('/') ? <Link to={item.href} className="text-premium-light/80 hover:text-premium-light transition-colors">
                  {item.label}
                </Link> : <a href={item.href} className="text-premium-light/80 hover:text-premium-light transition-colors">
                  {item.label}
                </a>}
            </div>)}
        </div>

        {/* CTA Button */}
        <Button variant="default" className="hidden lg:block bg-premium-gradient hover:opacity-90 transition-opacity">
          Darmowa wycena
        </Button>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden flex items-center text-premium-light relative z-50">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Services Mega Menu (Desktop) */}
      {isServicesOpen && <div className="absolute left-0 right-0 w-full z-40">
          <div ref={servicesRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="flex items-start justify-center pt-2">
            <div className="bg-premium-dark/95 border border-premium-light/10 p-12 w-full max-w-5xl grid grid-cols-4 gap-10 transform transition-all duration-300 animate-fade-in rounded-2xl">
              {servicesCategories.map((category, index) => <div key={index} className="flex flex-col">
                  <h3 className="text-lg font-medium text-premium-light mb-4 text-fuchsia-500">{category.title}</h3>
                  <div className="flex flex-col space-y-3">
                    {category.links.map((link, linkIndex) => <Link key={linkIndex} to={link.href.startsWith('#') ? `/${link.href}` : link.href} onClick={() => setIsServicesOpen(false)} className="text-premium-light/70 hover:text-premium-blue transition-colors text-sm group relative overflow-hidden">
                        <span className="relative z-10">{link.label}</span>
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-premium-blue transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                      </Link>)}
                  </div>
                </div>)}
            </div>
          </div>
        </div>}

      {/* Mobile Navigation */}
      <div className={cn("lg:hidden fixed inset-0 bg-premium-dark/98 z-40 flex flex-col justify-center items-center", isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} style={{
      transition: "opacity 300ms ease-in-out"
    }}>
        <div className="flex flex-col items-center space-y-6 w-full px-8 max-h-[80vh] overflow-y-auto py-8">
          {menuItems.map((item, index) => <div key={index} className="w-full text-center">
              {item.submenu ? <div className="flex flex-col items-center">
                  <button onClick={() => toggleMobileSubmenu(index)} className="text-xl font-medium text-premium-light/80 hover:text-premium-light transition-colors flex items-center gap-1">
                    {item.label}
                    <ChevronDown size={16} className={cn("transition-transform", activeSubmenu === index ? "rotate-180" : "")} />
                  </button>
                  
                  {activeSubmenu === index && <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full bg-premium-dark/80 rounded-lg p-4 border border-white/5 animate-fade-in">
                      {servicesCategories.map((category, catIndex) => <div key={catIndex} className="mb-4">
                          <h4 className="text-premium-purple font-medium mb-2">{category.title}</h4>
                          <div className="space-y-2">
                            {category.links.map((link, linkIndex) => <div key={linkIndex} className="w-full">
                                <Link to={link.href.startsWith('#') ? `/${link.href}` : link.href} onClick={() => {
                      setActiveSubmenu(null);
                      setIsOpen(false);
                    }} className="block text-sm text-premium-light/70 hover:text-premium-light transition-colors py-1">
                                  {link.label}
                                </Link>
                              </div>)}
                          </div>
                        </div>)}
                    </div>}
                </div> : item.href.startsWith('/') ? <Link to={item.href} onClick={() => setIsOpen(false)} className="text-xl font-medium text-premium-light/80 hover:text-premium-light transition-colors">
                  {item.label}
                </Link> : <a href={item.href} onClick={() => setIsOpen(false)} className="text-xl font-medium text-premium-light/80 hover:text-premium-light transition-colors">
                  {item.label}
                </a>}
            </div>)}
          <Button variant="default" className="mt-6 w-full max-w-xs bg-premium-gradient hover:opacity-90 transition-opacity">
            Darmowa wycena
          </Button>
        </div>
      </div>
    </nav>;
};
export default Navbar;