
// This file is now a placeholder for future Sanity.io auth integration

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  last_sign_in?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalLogins: number;
}

export type UserRole = 'user' | 'admin' | 'moderator' | 'blogger';
