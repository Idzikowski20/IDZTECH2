// Types related to authentication
import { User as FirebaseUser } from 'firebase/auth';

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
  signIn: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  signOut: () => void;
}
