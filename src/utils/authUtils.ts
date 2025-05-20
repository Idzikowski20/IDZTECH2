// Utility functions for authentication
import { User } from 'firebase/auth';

// Mock user database (will be connected to Firebase)
const users: User[] = [];

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
  users.splice(0, users.length, ...updatedUsers);
};

export const addUser = (user: User) => {
  users.push(user);
};

export const removeUser = (userId: string) => {
  const index = users.findIndex(user => user.uid === userId);
  if (index !== -1) {
    users.splice(index, 1);
  }
};

export const getUser = (userId: string) => {
  return users.find(user => user.uid === userId);
};

export const getAllUsers = () => {
  return [...users];
};
