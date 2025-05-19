
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-bold mb-4">IDZ.TECH</h3>
            <p className="text-gray-400 mb-6">
              Tworzymy skuteczne strony internetowe i zapewniamy kompleksowe rozwiązania SEO dla klientów w całej Polsce.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Column 2 - Usługi */}
          <div>
            <h3 className="text-lg font-bold mb-4">Usługi</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tworzenie-stron-www" className="text-gray-400 hover:text-white transition-colors">
                  Tworzenie stron www
                </Link>
              </li>
              <li>
                <Link to="/sklepy-internetowe" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                  Tworzenie sklepów internetowych
                </Link>
              </li>
              <li>
                <Link to="/pozycjonowanie-stron" className="text-gray-400 hover:text-white transition-colors">
                  Pozycjonowanie stron
                </Link>
              </li>
              <li>
                <Link to="/pozycjonowanie-lokalne" className="text-gray-400 hover:text-white transition-colors">
                  Pozycjonowanie lokalne
                </Link>
              </li>
              <li>
                <Link to="/audyt-seo" className="text-gray-400 hover:text-white transition-colors">
                  Audyt SEO
                </Link>
              </li>
              <li>
                <Link to="/optymalizacja-seo" className="text-gray-400 hover:text-white transition-colors">
                  Optymalizacja SEO
                </Link>
              </li>
              <li>
                <Link to="/copywriting-seo" className="text-gray-400 hover:text-white transition-colors">
                  Copywriting SEO
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Firma */}
          <div>
            <h3 className="text-lg font-bold mb-4">Firma</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Zapisz się do naszego newslettera, aby otrzymywać najnowsze wiadomości i oferty.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Twój email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l outline-none flex-grow"
              />
              <button 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r transition-colors"
                aria-label="Zapisz się do newslettera"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 IDZ.TECH - Wszelkie prawa zastrzeżone
          </p>
          <div className="flex space-x-4 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Polityka prywatności</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Warunki korzystania</Link>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        aria-label="Przewiń do góry"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;
