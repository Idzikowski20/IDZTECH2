import React from "react";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/utils/authTypes";

// Extended user profile interface to include additional fields
export interface ExtendedUserProfile {
  name?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  jobTitle?: string | null;
  role?: UserRole | null; // Changed from string to UserRole
}

export interface AuthContextType {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Added this property to fix the error
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
  refreshUserStats: () => void; // Added the missing property
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
