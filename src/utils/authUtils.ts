
// Utility functions for authentication
import { UserRole, User, UserStats } from './authTypes';

// Calculate user points based on activity
export const calculatePoints = (views: number, posts: number, comments: number, likes: number): number => {
  return (views * 1) + (posts * 50) + (comments * 10) + (likes * 5);
};

// Mock user database (will be connected to Supabase)
export let users: User[] = [
  {
    id: '1',
    email: 'admin@idztech.pl',
    name: 'Admin',
    role: 'admin',
    profilePicture: '',
    lastName: '',
    bio: 'Administrator serwisu IDZ.TECH',
    jobTitle: 'CEO',
    postsCreated: 5,
    totalViews: 0,
    createdAt: '2023-01-01T12:00:00Z',
    lastLogin: new Date().toISOString(),
    commentsCount: 0,
    likesCount: 0,
    stats: {
      views: 0,
      posts: 5,
      comments: 0,
      likes: 0,
      pointsTotal: 250, // 5 posts * 50 points
      pointsThisMonth: 0,
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: '2',
    email: 'patryk.idzikowski@interia.pl',
    name: 'Patryk',
    role: 'admin',
    profilePicture: '',
    lastName: 'Idzikowski',
    bio: 'Administrator serwisu',
    jobTitle: 'CEO',
    postsCreated: 5,
    totalViews: 0,
    createdAt: '2023-01-01T12:00:00Z',
    lastLogin: new Date().toISOString(),
    commentsCount: 0,
    likesCount: 0,
    stats: {
      views: 0,
      posts: 5,
      comments: 0,
      likes: 0,
      pointsTotal: 250,
      pointsThisMonth: 0,
      lastUpdated: new Date().toISOString()
    }
  }
];

// Password map (in a real app, these would be hashed)
export const passwords: Record<string, string> = {
  'admin@idztech.pl': 'admin123',
  'patryk.idzikowski@interia.pl': 'admin123',
  'mod@idztech.pl': 'mod123',
  'blogger@idztech.pl': 'blog123',
};

// Mock reset token storage
export const resetTokens: { email: string; token: string; expires: Date; }[] = [];

// Helper to update users array
export const updateUsersArray = (updatedUsers: User[]) => {
  users = updatedUsers;
};
