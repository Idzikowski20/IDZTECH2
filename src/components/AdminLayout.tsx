
import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PenSquare, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/AuthProvider';
import UserProfile from '@/components/UserProfile';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  // Define navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />, 
      exact: true 
    },
    { 
      name: 'Blog', 
      path: '/admin/blog', 
      icon: <FileText className="w-5 h-5 mr-2" />,
      submenu: [
        { name: 'Wszystkie posty', path: '/admin' },
        { name: 'Dodaj nowy', path: '/admin/new-post' }
      ]
    },
  ];
  
  // Helper to check if path is active
  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Toggle profile panel
  const toggleProfilePanel = () => {
    setShowUserProfile(!showUserProfile);
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-premium-dark flex flex-col md:flex-row">
      {/* Mobile navigation toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-premium-dark/80 backdrop-blur-md border-b border-premium-light/10">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl">IDZ.TECH</span>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`${
          mobileNavOpen ? 'block absolute inset-0 z-50 pt-16' : 'hidden'
        } md:block bg-premium-dark/50 backdrop-blur-lg border-r border-premium-light/10 w-full md:w-64 md:static md:pt-0 md:min-h-screen`}
      >
        {/* Logo - desktop only */}
        <div className="hidden md:flex items-center justify-between p-6 border-b border-premium-light/10">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">IDZ.TECH</span>
          </Link>
        </div>
        
        {/* Nav items */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                <li>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path, item.exact) 
                        ? 'bg-premium-light/10 text-white' 
                        : 'hover:bg-premium-light/5'
                    }`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
                
                {/* Submenu items */}
                {item.submenu && isActive(item.path) && (
                  <li className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        to={subitem.path}
                        className={`flex items-center px-4 py-2 rounded-md text-sm transition-colors ${
                          location.pathname === subitem.path
                            ? 'bg-premium-light/10 text-white' 
                            : 'hover:bg-premium-light/5 text-premium-light/70'
                        }`}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </li>
                )}
              </React.Fragment>
            ))}
            
            {/* Profile link */}
            <li>
              <button
                onClick={toggleProfilePanel}
                className={`flex w-full items-center px-4 py-3 rounded-md transition-colors ${
                  showUserProfile 
                    ? 'bg-premium-light/10 text-white' 
                    : 'hover:bg-premium-light/5'
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                <span>Profil</span>
              </button>
            </li>
            
            {/* Logout button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Wyloguj</span>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Back to site link - visible on mobile only */}
        <div className="md:hidden p-4 pt-6 border-t border-premium-light/10">
          <Link 
            to="/"
            className="flex items-center justify-center px-4 py-2 rounded-md text-sm bg-premium-light/5 hover:bg-premium-light/10 transition-colors"
            onClick={() => setMobileNavOpen(false)}
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content area */}
        <main className="flex-1">
          {showUserProfile ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Twój profil</h1>
                <Button variant="ghost" onClick={() => setShowUserProfile(false)}>
                  Powrót
                </Button>
              </div>
              <UserProfile />
            </div>
          ) : (
            children
          )}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-premium-light/10 p-4 text-center text-sm text-premium-light/50">
          &copy; {new Date().getFullYear()} IDZ.TECH - Panel administracyjny
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
