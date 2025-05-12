
import React from "react";
import { User, Session } from "@supabase/supabase-js";

// Extended user profile interface to include additional fields
export interface ExtendedUserProfile {
  name?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  jobTitle?: string | null;
}

export interface AuthContextType {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
