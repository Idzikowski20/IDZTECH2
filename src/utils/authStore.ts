
// This file is now a placeholder for future Sanity.io auth integration
// All previous auth store functionality has been removed to avoid errors
import { users } from './authTypes';

export const useAuthStore = () => {
  return {
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      totalLogins: 0
    },
    fetchAuthStats: () => {
      console.log("Auth stats functionality is currently disabled");
      return Promise.resolve();
    }
  };
};

// Add the missing useAuth export
export const useAuth = () => {
  return {
    user: users[0] || null,
    isAuthenticated: false,
    isLoading: false,
    signIn: async () => {
      console.log("Authentication is currently disabled");
    },
    signOut: () => {
      console.log("Authentication is currently disabled");
    },
    signUp: async () => {
      console.log("Authentication is currently disabled");
    },
    resetPassword: async () => {
      console.log("Authentication is currently disabled");
    }
  };
};
