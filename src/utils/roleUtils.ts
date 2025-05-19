
import { UserRole } from './authTypes';

/**
 * Safely converts a string value to UserRole enum
 * @param role The string value to convert
 * @returns A valid UserRole enum value or UserRole.USER as default
 */
export const ensureValidRole = (role: string | UserRole | null | undefined): UserRole => {
  if (!role) return UserRole.USER;
  
  // If it's already a UserRole enum value, return it
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  
  // Try to match string to enum
  const normalizedRole = role.toString().toLowerCase();
  
  switch(normalizedRole) {
    case 'admin':
      return UserRole.ADMIN;
    case 'editor':
      return UserRole.EDITOR;
    case 'guest':
      return UserRole.GUEST;
    case 'user':
    default:
      return UserRole.USER;
  }
};
