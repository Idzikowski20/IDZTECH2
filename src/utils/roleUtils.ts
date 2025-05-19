
import { UserRole } from './authTypes';

// Simple utility for auth types with role management
export const ensureValidRole = (role: string | null | undefined): UserRole => {
  if (!role) return 'user';
  
  const lowerRole = role.toString().toLowerCase();
  
  if (lowerRole === 'admin' || lowerRole === 'moderator' || lowerRole === 'user') {
    return lowerRole as UserRole;
  }
  
  return 'user';
};
