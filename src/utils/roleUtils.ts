
// Simple utility for auth types without role management
export const ensureValidRole = (role: string | null | undefined): string => {
  if (!role) return 'user';
  return role.toString().toLowerCase();
};
