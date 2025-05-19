
// Types related to authentication
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface ResetToken {
  email: string;
  token: string;
  expires: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  loading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  signOut: () => void;
}
