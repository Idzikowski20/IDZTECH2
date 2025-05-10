
import React, { useState, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, BarChart, Menu, X, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/auth';
import { useTheme } from '@/utils/themeContext';
import DotAnimation from './DotAnimation';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    logout,
    user
  } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [{
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/admin'
  }, {
    icon: BarChart,
    label: 'Statystyki',
    path: '/admin/stats'
  }, {
    icon: Users,
    label: 'Użytkownicy',
    path: '/admin/users'
  }, {
    icon: User,
    label: 'Profil',
    path: '/profile'
  }, {
    icon: Settings,
    label: 'Ustawienia',
    path: '/admin/settings'
  }];

  const themeClass = isDarkMode ? 'bg-premium-dark text-premium-light' : 'bg-premium-light text-premium-dark';

  return <div className={`flex h-screen ${themeClass} transition-colors duration-300`}>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setCollapsed(!collapsed)} 
          className={isDarkMode 
            ? "bg-premium-dark/50 border-premium-light/20" 
            : "bg-premium-light/50 border-premium-dark/20"
          }>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 lg:translate-x-0", 
        collapsed ? "-translate-x-full" : "translate-x-0",
        isDarkMode 
          ? "bg-premium-dark border-r border-premium-light/10" 
          : "bg-premium-light border-r border-premium-dark/10"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-2 p-6 border-b",
            isDarkMode ? "border-premium-light/10" : "border-premium-dark/10"
          )}>
            <div className="h-8 w-8 rounded-full bg-premium-gradient"></div>
            <span className="text-xl font-bold">IDZ<DotAnimation />TECH</span>
          </div>
          
          {/* User info */}
          {user && <div className={cn(
            "px-4 py-4 border-b",
            isDarkMode ? "border-premium-light/10" : "border-premium-dark/10"
          )}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : user.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-medium">{user.name} {user.lastName}</div>
                  <div className={cn(
                    "text-sm",
                    isDarkMode ? "text-premium-light/60" : "text-premium-dark/60"
                  )}>
                    {user.role === 'admin' ? 'Administrator' : 
                     user.role === 'moderator' ? 'Moderator' : 
                     user.role === 'blogger' ? 'Bloger' : 'Użytkownik'}
                  </div>
                </div>
              </div>
            </div>}
          
          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {navItems.map(item => <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isDarkMode
                  ? "text-premium-light/80 hover:bg-premium-light/5 hover:text-white"
                  : "text-premium-dark/80 hover:bg-premium-dark/5 hover:text-black",
                location.pathname === item.path && (
                  isDarkMode 
                    ? "bg-premium-light/10 text-premium-light" 
                    : "bg-premium-dark/10 text-premium-dark"
                )
              )}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>)}
          </nav>
          
          {/* Logout */}
          <div className={cn(
            "p-4 border-t",
            isDarkMode ? "border-premium-light/10" : "border-premium-dark/10"
          )}>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className={cn(
                "w-full justify-start",
                isDarkMode
                  ? "text-premium-light/80 hover:text-white bg-rose-900 hover:bg-rose-800"
                  : "text-premium-dark/80 hover:text-black bg-rose-200 hover:bg-rose-300"
              )}>
              <LogOut size={20} className="mr-3" />
              Wyloguj się
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-0" : "ml-0 lg:ml-64")}>
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>;
};

export default AdminLayout;
