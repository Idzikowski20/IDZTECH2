import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBlogStore } from '@/utils/blog';
import { supabase } from '@/utils/supabaseClient';

// Calculate user points based on activity
const calculatePoints = (views: number, posts: number, comments: number, likes: number): number => {
  return (views * 1) + (posts * 50) + (comments * 10) + (likes * 5);
};

export type UserRole = 'admin' | 'user' | 'moderator' | 'blogger';

export interface UserStats {
  views: number;
  posts: number;
  comments: number;
  likes: number;
  pointsTotal: number;
  pointsThisMonth: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  lastName?: string;
  bio?: string;
  jobTitle?: string;
  postsCreated?: number;
  totalViews?: number;
  createdAt?: string;
  lastLogin?: string;
  commentsCount?: number;
  likesCount?: number;
  stats: UserStats;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  getUsers: () => Promise<User[]>;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'postsCreated' | 'totalViews' | 'commentsCount' | 'likesCount' | 'stats'>, password: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  getUserById: (userId: string) => Promise<User | undefined>;
  getTopUser: () => Promise<User | undefined>;
  getTopUserOfMonth: () => Promise<User | undefined>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  refreshUserStats: () => void;
  getUserRanking: () => Promise<User[]>;
  signOut: () => void;
  fetchSupabaseUsers: () => Promise<void>;
}

// Mock user database (will be connected to Supabase)
let users: User[] = [
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
const passwords: Record<string, string> = {
  'admin@idztech.pl': 'admin123',
  'patryk.idzikowski@interia.pl': 'admin123',
  'mod@idztech.pl': 'mod123',
  'blogger@idztech.pl': 'blog123',
};

// Mock reset token storage
interface ResetToken {
  email: string;
  token: string;
  expires: Date;
}
const resetTokens: ResetToken[] = [];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      rememberMe: false,
      fetchSupabaseUsers: async () => {
        try {
          const { data: supaUsers, error } = await supabase.auth.admin.listUsers();
          
          if (error) {
            console.error("Error fetching Supabase users:", error);
            return;
          }

          if (supaUsers) {
            // Map Supabase users to our user format
            const mappedUsers: User[] = supaUsers.users.map(supaUser => {
              // Check if user already exists in our local store
              const existingUser = users.find(u => u.email === supaUser.email);
              
              if (existingUser) {
                return {
                  ...existingUser,
                  id: supaUser.id,
                  email: supaUser.email || existingUser.email,
                  lastLogin: supaUser.last_sign_in_at || existingUser.lastLogin,
                  createdAt: supaUser.created_at || existingUser.createdAt,
                };
              }

              // Create a new user if they don't exist
              const role: UserRole = supaUser.email === 'patryk.idzikowski@interia.pl' ? 'admin' : 'user';
              
              return {
                id: supaUser.id,
                email: supaUser.email || '',
                name: supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
                role,
                profilePicture: supaUser.user_metadata?.avatar_url || '',
                lastName: supaUser.user_metadata?.last_name || '',
                bio: '',
                jobTitle: '',
                postsCreated: 0,
                totalViews: 0,
                createdAt: supaUser.created_at || new Date().toISOString(),
                lastLogin: supaUser.last_sign_in_at || new Date().toISOString(),
                commentsCount: 0,
                likesCount: 0,
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
            });

            // Update our users array with the mapped users
            users = mappedUsers;
          }
        } catch (error) {
          console.error("Error in fetchSupabaseUsers:", error);
        }
      },
      login: async (email: string, password: string, remember = false) => {
        try {
          // Try to login with Supabase first
          const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (supaData.user) {
            // Make sure user exists in our local store
            let user = users.find((u) => u.email === email);
            
            if (!user) {
              // Create a new user entry if they don't exist locally
              const role: UserRole = email === 'patryk.idzikowski@interia.pl' ? 'admin' : 'user';
              
              user = {
                id: supaData.user.id,
                email: supaData.user.email || '',
                name: supaData.user.user_metadata?.name || email.split('@')[0],
                role,
                profilePicture: supaData.user.user_metadata?.avatar_url || '',
                lastName: supaData.user.user_metadata?.last_name || '',
                createdAt: supaData.user.created_at,
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
              
              users.push(user);
            } else {
              // Update last login time
              user.lastLogin = new Date().toISOString();
            }
            
            set({ user, isAuthenticated: true, rememberMe: remember });
            return true;
          } else if (supaError) {
            // Fallback to mock login system
            const mockUser = users.find((u) => u.email === email);
            
            if (mockUser && passwords[email] === password) {
              mockUser.lastLogin = new Date().toISOString();
              set({ user: mockUser, isAuthenticated: true, rememberMe: remember });
              return true;
            }
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      register: async (email: string, name: string, password: string) => {
        try {
          // Try to register with Supabase
          const { data: supaData, error: supaError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              },
            },
          });

          if (supaData.user) {
            // Create new user in local store
            const newUser: User = {
              id: supaData.user.id,
              email,
              name,
              role: 'user',
              profilePicture: '',
              lastName: '',
              bio: '',
              jobTitle: '',
              postsCreated: 0,
              totalViews: 0,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              commentsCount: 0,
              likesCount: 0,
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
            
            // Add to local users
            users.push(newUser);
            
            // Auto login after registration
            set({ user: newUser, isAuthenticated: true });
            return true;
          } else if (supaError) {
            // Fallback to mock registration
            // Check if user already exists
            if (users.some((u) => u.email === email)) {
              return false;
            }
            
            // Create new user
            const newUser: User = {
              id: String(users.length + 1),
              email,
              name,
              role: 'user',
              profilePicture: '',
              lastName: '',
              bio: '',
              jobTitle: '',
              postsCreated: 0,
              totalViews: 0,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              commentsCount: 0,
              likesCount: 0,
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
            
            // In a real app, you would hash the password and save to a database
            users.push(newUser);
            passwords[email] = password;
            
            // Auto login after registration
            set({ user: newUser, isAuthenticated: true });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        supabase.auth.signOut();
      },
      signOut: () => {
        set({ user: null, isAuthenticated: false });
        supabase.auth.signOut();
      },
      updateProfile: (data) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
          
          // Update in "database" as well
          const index = users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            users[index] = updatedUser;
          }
        }
      },
      updatePassword: async (currentPassword: string, newPassword: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Verify the current password
        if (passwords[user.email] !== currentPassword) {
          return false;
        }
        
        // Update the password
        passwords[user.email] = newPassword;
        return true;
      },
      getUsers: async () => {
        // Fetch Supabase users first
        await get().fetchSupabaseUsers();
        
        // Refresh user stats before returning users
        get().refreshUserStats();
        return [...users];
      },
      addUser: async (userData, password) => {
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
          return false;
        }

        try {
          // Try to create user in Supabase
          const { data, error } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: password,
            user_metadata: {
              name: userData.name,
              last_name: userData.lastName,
              role: userData.role
            },
          });

          if (error) {
            console.error("Error creating Supabase user:", error);
            return false;
          }

          if (data.user) {
            const newUser: User = {
              ...userData,
              id: data.user.id,
              postsCreated: 0,
              totalViews: 0,
              createdAt: data.user.created_at,
              lastLogin: new Date().toISOString(),
              commentsCount: 0,
              likesCount: 0,
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

            users.push(newUser);
            passwords[userData.email] = password;
            return true;
          }
          
          return false;
        } catch (error) {
          console.error("Error in addUser:", error);
          return false;
        }
      },
      updateUserRole: async (userId, role) => {
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        
        users[index].role = role;

        try {
          // Also update in Supabase if possible
          const user = users[index];
          const { data, error } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { role: role } }
          );

          if (error) {
            console.error("Error updating user role in Supabase:", error);
            // Continue anyway with local update
          }
          
          return true;
        } catch (error) {
          console.error("Error in updateUserRole:", error);
          return true; // Still return true as local update succeeded
        }
      },
      getUserById: async (userId) => {
        return users.find(u => u.id === userId);
      },
      getTopUser: async () => {
        if (users.length === 0) return undefined;
        return [...users].sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal)[0];
      },
      getTopUserOfMonth: async () => {
        if (users.length === 0) return undefined;
        return [...users].sort((a, b) => b.stats.pointsThisMonth - a.stats.pointsThisMonth)[0];
      },
      getUserRanking: async () => {
        return [...users].sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal);
      },
      forgotPassword: async (email: string) => {
        try {
          // Try with Supabase first
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          
          if (error) {
            console.error("Error in Supabase password reset:", error);
            // Fall back to local mechanism
          }

          // Check if the user exists
          const user = users.find((u) => u.email === email);
          if (!user) {
            // We don't want to reveal if the email exists or not for security reasons
            console.log(`Password reset requested for non-existent user: ${email}`);
            return true;
          }
          
          // Generate a token
          const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          
          // Set expiration to 24 hours from now
          const expires = new Date();
          expires.setHours(expires.getHours() + 24);
          
          // Store the reset token
          resetTokens.push({
            email,
            token,
            expires
          });
          
          // W prawdziwej implementacji należy wysłać email z linkiem resetującym
          console.log('Password reset requested for:', email);
          console.log('Reset link:', `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
          
          // Generujemy link do resetu hasła
          const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
          
          // W produkcyjnej implementacji ten kod zostanie zastąpiony przez API do wysyłki maili
          // ale tymczasowo możemy pokazywać link w konsoli
          console.log('Tutaj powinno być wywołanie API do wysyłki maila z linkiem:', resetLink);
          
          return true;
        } catch (error) {
          console.error("Error in forgotPassword:", error);
          return false;
        }
      },
      resetPassword: async (email: string, token: string, newPassword: string) => {
        try {
          // First check if there's a valid token in our mock system
          const tokenIndex = resetTokens.findIndex(
            (rt) => rt.email === email && rt.token === token && new Date() < rt.expires
          );
          
          if (tokenIndex !== -1) {
            // Token is valid, update the password
            passwords[email] = newPassword;
            
            // Remove the used token
            resetTokens.splice(tokenIndex, 1);
            
            return true;
          }
          
          // If no token found in our mock system, try Supabase
          // Note: This only works if user has received a reset email from Supabase
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          
          if (error) {
            console.error("Error updating password in Supabase:", error);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("Error in resetPassword:", error);
          return false;
        }
      },
      deleteUser: async (userId: string) => {
        try {
          const index = users.findIndex(u => u.id === userId);
          if (index === -1) return false;
          
          // Check if trying to delete the current user (shouldn't delete yourself)
          const { user } = get();
          if (user?.id === userId) return false;
          
          // Try to delete in Supabase
          const { error } = await supabase.auth.admin.deleteUser(userId);
          
          if (error) {
            console.error("Error deleting user from Supabase:", error);
            // Continue with local deletion anyway
          }
          
          // Delete the user from local store
          const deletedUser = users.splice(index, 1)[0];
          
          // Clean up password record
          if (deletedUser.email in passwords) {
            delete passwords[deletedUser.email];
          }
          
          return true;
        } catch (error) {
          console.error("Error in deleteUser:", error);
          return false;
        }
      },
      refreshUserStats: () => {
        // Get blog posts from store to calculate real statistics
        const blogStore = useBlogStore.getState();
        const posts = blogStore.posts || []; // Add fallback to empty array if posts is undefined
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Calculate statistics for each user
        users.forEach(user => {
          // Get user-authored posts
          const userPosts = posts.filter(post => post.author === user.name);
          
          // Count posts
          const postsCount = userPosts.length;
          
          // Sum up total views from all user's posts
          const viewsCount = userPosts.reduce((sum, post) => sum + post.views, 0);
          
          // Count comments made by this user (across all posts)
          const commentsCount = posts.reduce((sum, post) => {
            // Check if post.comments exists before trying to filter it
            return sum + (post.comments && Array.isArray(post.comments) 
              ? post.comments.filter(comment => comment.userId === user.id).length 
              : 0);
          }, 0);
          
          // Count likes given by this user (across all posts)
          const likesCount = posts.reduce((sum, post) => {
            // Check if post.likes exists before trying to check if it includes user.id
            return sum + (post.likes && Array.isArray(post.likes) 
              ? (post.likes.includes(user.id) ? 1 : 0)
              : 0);
          }, 0);
          
          // Calculate monthly stats
          let pointsThisMonth = 0;
          posts.forEach(post => {
            const postDate = new Date(post.date);
            
            // Only count posts from current month
            if (postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear) {
              // Count contributions from this month
              if (post.author === user.name) {
                pointsThisMonth += 50; // Points for creating a post this month
              }
              
              // Count views from this month's posts
              if (post.author === user.name) {
                pointsThisMonth += post.views;
              }
              
              // Count comments from this month
              if (post.comments && Array.isArray(post.comments)) {
                post.comments.forEach(comment => {
                  if (comment.userId === user.id) {
                    const commentDate = new Date(comment.date);
                    if (commentDate.getMonth() === currentMonth && commentDate.getFullYear() === currentYear) {
                      pointsThisMonth += 10;
                    }
                  }
                });
              }
              
              // Count likes from this month
              if (post.likes && Array.isArray(post.likes) && post.likes.includes(user.id)) {
                pointsThisMonth += 5;
              }
            }
          });
          
          // Calculate total points
          const pointsTotal = calculatePoints(viewsCount, postsCount, commentsCount, likesCount);
          
          // Update user stats
          user.postsCreated = postsCount;
          user.totalViews = viewsCount;
          user.commentsCount = commentsCount;
          user.likesCount = likesCount;
          user.stats = {
            views: viewsCount,
            posts: postsCount,
            comments: commentsCount,
            likes: likesCount,
            pointsTotal: pointsTotal,
            pointsThisMonth: pointsThisMonth,
            lastUpdated: new Date().toISOString()
          };
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Helper functions
export const forgotPassword = (email: string) => {
  return useAuth.getState().forgotPassword(email);
};

export const resetPassword = (email: string, token: string, newPassword: string) => {
  return useAuth.getState().resetPassword(email, token, newPassword);
};

// Initialize by fetching Supabase users on load
useAuth.getState().fetchSupabaseUsers();
