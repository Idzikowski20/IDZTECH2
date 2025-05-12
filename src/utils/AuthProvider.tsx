
import React, { useState, useEffect, useContext } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileManager } from "@/hooks/useProfileManager";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Fix the re-export by using "export type" syntax
export type { ExtendedUserProfile } from "@/contexts/AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const { 
    user, 
    session, 
    loading, 
    isAuthenticated, 
    signIn, 
    signOut, 
    resetPassword, 
    updatePassword 
  } = useAuthState(navigate, location);
  
  const { updateProfile } = useProfileManager(user);

  // Mark authentication as initialized after a delay to ensure proper state
  useEffect(() => {
    if (!loading && !authInitialized) {
      const timer = setTimeout(() => {
        setAuthInitialized(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loading, authInitialized]);

  // Add isLoading as an alias to loading to maintain backward compatibility
  const value: AuthContextType = {
    user,
    session,
    loading: loading || !authInitialized,
    isLoading: loading || !authInitialized,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
