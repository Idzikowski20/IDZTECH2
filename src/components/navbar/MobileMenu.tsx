
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NavigationMenu from './NavigationMenu';

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
        <NavigationMenu onNavItemClick={() => setIsMenuOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
