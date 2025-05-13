
// This file is now a placeholder for future Sanity.io auth integration

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  lastName?: string;
  jobTitle?: string;
  created_at?: string;
  last_sign_in?: string;
  stats?: {
    views: number;
    posts: number;
    comments: number;
    likes: number;
    pointsTotal: number;
    pointsThisMonth: number;
    lastUpdated: string;
  };
}

export interface User extends UserProfile {
  // Added properties needed across the app
  profilePicture?: string;
  lastName?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalLogins: number;
}

export type UserRole = 'user' | 'admin' | 'moderator' | 'blogger';

// Add calculatePoints function
export const calculatePoints = (views: number, posts: number, comments: number, likes: number): number => {
  return views + (posts * 50) + (comments * 10) + (likes * 5);
};

// Mock users array for temporary use
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    profilePicture: '',
    created_at: new Date().toISOString(),
    stats: {
      views: 100,
      posts: 5,
      comments: 10,
      likes: 15,
      pointsTotal: 500,
      pointsThisMonth: 150,
      lastUpdated: new Date().toISOString()
    }
  }
];
