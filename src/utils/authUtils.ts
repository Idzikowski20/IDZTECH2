
// Utility functions for authentication
import { User } from './authTypes';

// Mock user database (will be connected to Supabase)
export let users: User[] = [
  {
    id: '1',
    email: 'admin@idztech.pl',
    name: 'Admin',
    createdAt: '2023-01-01T12:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'patryk.idzikowski@interia.pl',
    name: 'Patryk',
    createdAt: '2023-01-01T12:00:00Z',
    lastLogin: new Date().toISOString()
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
