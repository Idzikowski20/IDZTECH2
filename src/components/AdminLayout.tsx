
import React, { useState, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  BarChart,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/auth';
import DotAnimation from './DotAnimation';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin' 
    },
    { 
      icon: FileText, 
      label: 'Zarządzanie blogiem', 
      path: '/admin/posts' 
    },
    { 
      icon: BarChart, 
      label: 'Statystyki', 
      path: '/admin/stats' 
    },
    { 
      icon: Users, 
      label: 'Użytkownicy', 
      path: '/admin/users' 
    },
    { 
      icon: Settings, 
      label: 'Ustawienia', 
      path: '/admin/settings' 
    },
  ];

  return (
    <div className="flex h-screen bg-premium-dark">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="bg-premium-dark/50 border-premium-light/20"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-premium-dark border-r border-premium-light/10 transition-transform duration-300 lg:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-premium-light/10">
            <div className="h-8 w-8 rounded-full bg-premium-gradient"></div>
            <span className="text-xl font-bold">IDZ<DotAnimation />TECH</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-premium-light/80 hover:bg-premium-light/5 hover:text-premium-light transition-colors",
                  location.pathname === item.path && "bg-premium-light/10 text-premium-light"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-premium-light/10">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-premium-light/80 hover:text-premium-light"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Wyloguj się
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-0" : "ml-0 lg:ml-64"
      )}>
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
