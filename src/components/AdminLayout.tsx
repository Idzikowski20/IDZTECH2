
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSanityAuth } from '@/utils/SanityAuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from '@/components/ModeToggle';
import AdminMobileMenu from './AdminMobileMenu';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useSanityAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex justify-between items-center p-4 md:hidden bg-premium-dark border-b border-premium-light/10">
        <Link to="/" className="flex items-center">
          <img src="/idztech-logo.svg" alt="IDZ.Tech Logo" className="h-8 mr-2" />
          <span className="font-bold text-xl">IDZ.Tech</span>
        </Link>
        <AdminMobileMenu />
      </div>
      <div className="hidden md:flex w-64 flex-shrink-0 flex-col bg-premium-dark border-r border-premium-light/10">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4">
            <Link to="/" className="flex items-center">
              <img src="/idztech-logo.svg" alt="IDZ.Tech Logo" className="h-8 mr-2" />
              <span className="font-bold text-xl">IDZ.Tech</span>
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <Link
              to="/admin"
              className={`${isActive('/admin') ? 'bg-premium-purple/20 text-white' : 'text-gray-300 hover:bg-premium-purple/10 hover:text-white'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              <svg className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h12a1 1 0 001-1v-10M4 7h16" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`${isActive('/admin/users') ? 'bg-premium-purple/20 text-white' : 'text-gray-300 hover:bg-premium-purple/10 hover:text-white'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-5.197m3 5.197H12" />
              </svg>
              Użytkownicy
            </Link>
            <Link
              to="/admin/studio"
              className={`${isActive('/admin/studio') ? 'bg-premium-purple/20 text-white' : 'text-gray-300 hover:bg-premium-purple/10 hover:text-white'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Sanity Studio
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-premium-light/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex h-8 w-full items-center justify-between rounded-md px-2 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture || 'https://github.com/shadcn.png'} alt={user?.name || 'Avatar'} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  {user?.name}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 opacity-50"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount className="w-56">
              <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>Wyloguj się</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ModeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AdminLayout;
