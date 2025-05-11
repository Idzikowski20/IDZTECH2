
import React from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileManager } from "@/hooks/useProfileManager";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export { ExtendedUserProfile } from "@/contexts/AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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

  const value: AuthContextType = {
    user,
    session,
    loading,
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
