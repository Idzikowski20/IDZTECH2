
// Types related to authentication
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserStats {
  views: number;
  posts: number;
  comments: number;
  likes: number;
  pointsTotal: number;
  pointsThisMonth: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastLogin?: string;
  stats?: UserStats;
  user_metadata?: {
    avatar_url?: string;
    name?: string;
  };
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
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  signIn: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  signOut: () => void;
}
