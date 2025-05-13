
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import { Button } from '@/components/ui/button';
import { Home, FileText, Info, Phone, User, Settings, LogOut } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, signOut } = useAuth();
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  if (!isMenuOpen) return null;

  return (
    <div className="sm:hidden bg-slate-950 border-t border-slate-800 pb-3 pt-2">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link 
          to="/" 
          className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
          onClick={handleLinkClick}
        >
          <Home className="h-5 w-5 mr-3" />
          Strona główna
        </Link>
        
        <Accordion type="single" collapsible className="w-full border-none">
          <AccordionItem value="uslugi" className="border-none">
            <AccordionTrigger className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3" />
                Usługi
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-8 space-y-1">
                <Link 
                  to="/seo" 
                  className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
                  onClick={handleLinkClick}
                >
                  SEO
                </Link>
                <Link 
                  to="/content-plan" 
                  className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
                  onClick={handleLinkClick}
                >
                  Plan treści
                </Link>
                <Link 
                  to="/google-ads" 
                  className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
                  onClick={handleLinkClick}
                >
                  Google Ads
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Link 
          to="/about-us" 
          className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
          onClick={handleLinkClick}
        >
          <Info className="h-5 w-5 mr-3" />
          O nas
        </Link>
        
        <Link 
          to="/contact" 
          className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
          onClick={handleLinkClick}
        >
          <Phone className="h-5 w-5 mr-3" />
          Kontakt
        </Link>
        
        {/* User related links */}
        {user && (
          <div className="border-t border-slate-700 pt-2 mt-2">
            <Link 
              to="/profile" 
              className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
              onClick={handleLinkClick}
            >
              <User className="h-5 w-5 mr-3" />
              Profil
            </Link>
            
            {(user.role === 'admin' || user.role === 'administrator') && (
              <Link 
                to="/admin" 
                className="flex items-center text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
                onClick={handleLinkClick}
              >
                <Settings className="h-5 w-5 mr-3" />
                Admin panel
              </Link>
            )}
            
            <Button 
              variant="ghost"
              className="flex w-full items-center justify-start text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Wyloguj
            </Button>
          </div>
        )}
        
        {/* Login button for non-authenticated users */}
        {!user && (
          <div className="border-t border-slate-700 pt-2 mt-2">
            <Button 
              variant="ghost"
              className="flex w-full items-center justify-start bg-premium-gradient text-white hover:bg-white hover:text-black rounded-md px-3 py-2"
              asChild
            >
              <Link 
                to="/login"
                onClick={handleLinkClick}
              >
                Zaloguj się
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
