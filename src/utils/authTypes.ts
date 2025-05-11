
// Types related to authentication
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | 'moderator' | 'blogger';

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
  role: UserRole;
  profilePicture?: string;
  lastName?: string;
  bio?: string;
  jobTitle?: string;
  postsCreated?: number;
  totalViews?: number;
  createdAt?: string;
  lastLogin?: string;
  commentsCount?: number;
  likesCount?: number;
  stats: UserStats;
  user_metadata?: {
    avatar_url?: string;
    name?: string;
    last_name?: string;
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
  getUsers: () => Promise<User[]>;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'postsCreated' | 'totalViews' | 'commentsCount' | 'likesCount' | 'stats'>, password: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  getUserById: (userId: string) => Promise<User | undefined>;
  getTopUser: () => Promise<User | undefined>;
  getTopUserOfMonth: () => Promise<User | undefined>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  refreshUserStats: () => void;
  getUserRanking: () => Promise<User[]>;
  signOut: () => void;
  fetchSupabaseUsers: () => Promise<void>;
}
