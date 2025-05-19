
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { AuthContextType, ExtendedUserProfile } from "@/contexts/AuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    user,
    session,
    loading: isLoading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  } = useAuthState(navigate, location);
  
  const value = {
    user,
    session,
    loading: isLoading,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
