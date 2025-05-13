
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from './authTypes';
import { validateToken, logoutUser } from './authSanity';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useSanityAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const SanityAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const { valid, user } = await validateToken(token);
          
          if (valid && user) {
            setUser(user);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('authToken');
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      logoutUser(token);
      localStorage.removeItem('authToken');
    }
    
    setUser(null);
    
    toast({
      title: 'Wylogowano',
      description: 'Pomyślnie wylogowano z systemu',
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...userData,
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default SanityAuthProvider;
