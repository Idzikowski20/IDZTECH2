
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings, Lock } from 'lucide-react';
import { useAuth } from '@/utils/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Brand from './Brand';
import DesktopNavigation from './DesktopNavigation';
import DesktopControls from './DesktopControls';
import MobileMenu from './MobileMenu';
import NotificationBell from '../NotificationBell';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const { notificationCount } = useSupabaseNotifications();

  // Function to handle sign out
  const handleSignOut = async () => {
    await signOut();
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  // Function to determine if the current route is admin
  const isAdminRoute = () => {
    return location.pathname.startsWith('/admin');
  };

  return (
    <nav className="bg-slate-950 text-white border-b border-slate-800 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>

          {/* Logo/Brand */}
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Brand />
            </div>
            <div className="hidden sm:block sm:ml-6">
              {/* Desktop Navigation */}
              <DesktopNavigation />
            </div>
          </div>

          {/* Right side controls - desktop */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:block">
              <DesktopControls />
            </div>

            {/* Notification Bell */}
            <div className="ml-3">
              <NotificationBell count={notificationCount} />
            </div>

            {/* Profile dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-3 hover:bg-white hover:text-black relative rounded-full overflow-hidden"
                  >
                    <Avatar>
                      <AvatarImage src={user.profilePicture || undefined} alt={user.name || 'User avatar'} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="ml-3 bg-premium-gradient hover:bg-white hover:text-black">
                <Link to="/login">
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </nav>
  );
};

export default Navbar;
