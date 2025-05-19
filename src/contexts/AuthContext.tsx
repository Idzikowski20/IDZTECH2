
import React from "react";
import { User, Session } from "@supabase/supabase-js";

// Export this interface so it can be used elsewhere
export interface ExtendedUserProfile {
  name?: string | null;
}

export interface AuthContextType {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
