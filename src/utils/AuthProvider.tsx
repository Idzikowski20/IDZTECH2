
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { AuthContextType, ExtendedUserProfile } from "@/contexts/AuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    session,
    loading: isLoading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  } = useAuthState();
  
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
