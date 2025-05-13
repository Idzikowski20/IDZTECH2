
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Basic types for auth functionality
interface User {
  id: string;
  email?: string;
  name?: string;
  lastName?: string;
  role?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {},
  signOut: () => {},
  signUp: async () => {},
  resetPassword: async () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder auth functions
  const signIn = async () => {
    console.log("Authentication is currently disabled");
  };

  const signOut = () => {
    console.log("Authentication is currently disabled");
  };

  const signUp = async () => {
    console.log("Authentication is currently disabled");
  };

  const resetPassword = async () => {
    console.log("Authentication is currently disabled");
  };

  const value = {
    user: null,
    isAuthenticated: false,
    isLoading,
    signIn,
    signOut,
    signUp,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
