
// This file defines the local auth store as a backup for when Supabase auth is disabled
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabaseUpdateUserRole } from './authSupabaseIntegration';
import { User, UserRole } from './authTypes';
// Remove the incorrect import
// import { Password } from './passwordValidation';

// Initial users
let users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin',
    role: 'admin',
    profilePicture: '',
    lastName: '',
    bio: '',
    jobTitle: '',
    postsCreated: 0,
    commentsCount: 0,
    likesCount: 0,
    totalViews: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    stats: {
      views: 0,
      posts: 0,
      comments: 0,
      likes: 0,
      pointsTotal: 0,
      pointsThisMonth: 0,
      lastUpdated: new Date().toISOString()
    }
  }
];

// Store for user passwords (in a real app, this would use proper hashing)
export const passwords: { [email: string]: string } = {
  'admin@example.com': 'Password123!'
};

// Helper to update users array and return the new array
export const updateUsersArray = (updatedUsers: User[]) => {
  users = updatedUsers;
  return users;
};

// Get user by ID
export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

// Function to update user role safely
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return false;
    
    // First try to update in Supabase if it's a Supabase user
    if (userId.indexOf('local-') !== 0) {
      const result = await supabaseUpdateUserRole(userId, role);
      if (result.error) {
        console.error("Error updating role in Supabase:", result.error);
      }
    }
    
    // Always update in local store
    const updatedUsers = [...users];
    updatedUsers[userIndex].role = role;
    updateUsersArray(updatedUsers);
    
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
};

// Local Auth Store
interface AuthStore {
  currentUserId: string | null;
  isAuthenticated: boolean;
  user: User | null; // Add user property
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, password: string) => Promise<boolean>;
  updateUser: (userId: string, data: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getUsers: () => User[];
  getCurrentUser: () => User | null;
  getUserRanking: () => Promise<User[]>; // Add missing methods
  refreshUserStats: () => void; // Add missing methods
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>; // Add missing method
  addUser: (userData: Partial<User>, password: string) => Promise<boolean>; // Add missing method
}

// Create the auth store
export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      isAuthenticated: false,
      user: null, // Initialize user property
      
      // Login
      login: async (email: string, password: string) => {
        try {
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          const storedPassword = passwords[email.toLowerCase()];
          
          if (!user || !storedPassword || storedPassword !== password) {
            return false;
          }
          
          // Update last login
          const updatedUsers = users.map(u => 
            u.id === user.id 
              ? { ...u, lastLogin: new Date().toISOString() } 
              : u
          );
          
          updateUsersArray(updatedUsers);
          
          set({ currentUserId: user.id, isAuthenticated: true, user });
          return true;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      
      // Logout
      logout: async () => {
        set({ currentUserId: null, isAuthenticated: false, user: null });
      },
      
      // Register
      register: async (email: string, name: string, password: string) => {
        try {
          const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (existingUser) {
            return false;
          }
          
          // Create user
          const newUser: User = {
            id: `local-${Date.now()}`,
            email: email.toLowerCase(),
            name,
            role: 'user',
            profilePicture: '',
            lastName: '',
            bio: '',
            jobTitle: '',
            postsCreated: 0,
            commentsCount: 0,
            likesCount: 0,
            totalViews: 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            stats: {
              views: 0,
              posts: 0,
              comments: 0,
              likes: 0,
              pointsTotal: 0,
              pointsThisMonth: 0,
              lastUpdated: new Date().toISOString()
            }
          };
          
          // Add user and password
          updateUsersArray([...users, newUser]);
          passwords[email.toLowerCase()] = password;
          
          return true;
        } catch (error) {
          console.error("Registration error:", error);
          return false;
        }
      },
      
      // Forgot password
      forgotPassword: async (email: string) => {
        try {
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          return !!user;
        } catch (error) {
          console.error("Forgot password error:", error);
          return false;
        }
      },
      
      // Reset password
      resetPassword: async (email: string, password: string) => {
        try {
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            return false;
          }
          
          passwords[email.toLowerCase()] = password;
          return true;
        } catch (error) {
          console.error("Reset password error:", error);
          return false;
        }
      },
      
      // Update user
      updateUser: async (userId: string, data: Partial<User>) => {
        try {
          const userIndex = users.findIndex(u => u.id === userId);
          
          if (userIndex === -1) {
            return false;
          }
          
          const updatedUsers = [...users];
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            ...data
          };
          
          updateUsersArray(updatedUsers);
          
          // Update current user if it's the logged-in user
          if (get().currentUserId === userId) {
            set({ user: updatedUsers[userIndex] });
          }
          
          return true;
        } catch (error) {
          console.error("Update user error:", error);
          return false;
        }
      },
      
      // Delete user
      deleteUser: async (userId: string) => {
        try {
          const userIndex = users.findIndex(u => u.id === userId);
          
          if (userIndex === -1) {
            return false;
          }
          
          const userEmail = users[userIndex].email;
          
          const updatedUsers = users.filter(u => u.id !== userId);
          updateUsersArray(updatedUsers);
          
          // Remove password
          if (passwords[userEmail.toLowerCase()]) {
            delete passwords[userEmail.toLowerCase()];
          }
          
          return true;
        } catch (error) {
          console.error("Delete user error:", error);
          return false;
        }
      },
      
      // Get users
      getUsers: () => {
        return users;
      },
      
      // Get current user
      getCurrentUser: () => {
        const { currentUserId } = get();
        if (!currentUserId) return null;
        
        const currentUser = users.find(u => u.id === currentUserId) || null;
        
        // Update the user state if found
        if (currentUser && get().user?.id !== currentUser.id) {
          set({ user: currentUser });
        }
        
        return currentUser;
      },
      
      // Get user ranking
      getUserRanking: async () => {
        // Sort users by points (descending)
        return [...users].sort((a, b) => 
          b.stats.pointsTotal - a.stats.pointsTotal
        );
      },
      
      // Refresh user stats
      refreshUserStats: () => {
        // This function would typically update user stats based on activities
        console.log("Refreshing user stats");
        // Implementation would depend on your specific requirements
      },
      
      // Update user role (implementation already exists as external function)
      updateUserRole: async (userId: string, role: UserRole) => {
        return updateUserRole(userId, role);
      },
      
      // Add user
      addUser: async (userData: Partial<User>, password: string) => {
        try {
          if (!userData.email || !password) {
            return false;
          }
          
          const existingUser = users.find(u => 
            u.email.toLowerCase() === userData.email!.toLowerCase()
          );
          
          if (existingUser) {
            return false;
          }
          
          // Create new user
          const newUser: User = {
            id: `local-${Date.now()}`,
            email: userData.email.toLowerCase(),
            name: userData.name || 'User',
            role: userData.role || 'user',
            lastName: userData.lastName || '',
            profilePicture: userData.profilePicture || '',
            bio: userData.bio || '',
            jobTitle: userData.jobTitle || '',
            postsCreated: 0,
            commentsCount: 0,
            likesCount: 0,
            totalViews: 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            stats: {
              views: 0,
              posts: 0,
              comments: 0,
              likes: 0,
              pointsTotal: 0,
              pointsThisMonth: 0,
              lastUpdated: new Date().toISOString()
            }
          };
          
          // Add user and password
          updateUsersArray([...users, newUser]);
          passwords[userData.email.toLowerCase()] = password;
          
          return true;
        } catch (error) {
          console.error("Add user error:", error);
          return false;
        }
      }
    }),
    { name: "auth-store" }
  )
);

// Export the User type for other components to use
export type { User } from './authTypes';
