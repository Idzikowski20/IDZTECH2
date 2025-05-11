
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBlogStore } from '@/utils/blog';

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
  updatePassword: (newPassword: string) => Promise<{ error?: Error }>;
  getUsers: () => User[];
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'postsCreated' | 'totalViews' | 'commentsCount' | 'likesCount' | 'stats'>, password: string) => boolean;
  updateUserRole: (userId: string, role: UserRole) => boolean;
  getUserById: (userId: string) => User | undefined;
  getTopUser: () => User | undefined;
  getTopUserOfMonth: () => User | undefined;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  deleteUser: (userId: string) => boolean;
  refreshUserStats: () => void;
  getUserRanking: () => User[];
}

// Mock user database
const users: User[] = [
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
    email: 'mod@idztech.pl',
    name: 'Moderator',
    role: 'moderator',
    profilePicture: '',
    lastName: 'Test',
    bio: 'Moderator serwisu',
    jobTitle: 'Content Manager',
    postsCreated: 3,
    totalViews: 0,
    createdAt: '2023-05-15T10:30:00Z',
    lastLogin: '2023-05-20T14:22:00Z',
    commentsCount: 0,
    likesCount: 0,
    stats: {
      views: 0,
      posts: 3,
      comments: 0,
      likes: 0,
      pointsTotal: 150, // 3 posts * 50 points
      pointsThisMonth: 0,
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: '3',
    email: 'blogger@idztech.pl',
    name: 'Bloger',
    role: 'blogger',
    profilePicture: '',
    lastName: 'Kowalski',
    bio: 'Twórca treści',
    jobTitle: 'Writer',
    postsCreated: 8,
    totalViews: 0,
    createdAt: '2023-06-10T09:15:00Z',
    lastLogin: '2023-06-25T16:40:00Z',
    commentsCount: 0,
    likesCount: 0,
    stats: {
      views: 0,
      posts: 8,
      comments: 0,
      likes: 0,
      pointsTotal: 400, // 8 posts * 50 points
      pointsThisMonth: 0,
      lastUpdated: new Date().toISOString()
    }
  }
];

// Password map (in a real app, these would be hashed)
const passwords: Record<string, string> = {
  'admin@idztech.pl': 'admin123',
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
      login: async (email: string, password: string, remember = false) => {
        // Simple mock login - in a real app, you'd call an API
        const user = users.find((u) => u.email === email);
        
        if (user && passwords[email] === password) {
          // Update last login time
          user.lastLogin = new Date().toISOString();
          set({ user, isAuthenticated: true, rememberMe: remember });
          return true;
        }
        
        return false;
      },
      register: async (email: string, name: string, password: string) => {
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
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
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
      updatePassword: async (newPassword: string) => {
        const { user } = get();
        if (!user) return { error: new Error('User not authenticated') };
        
        try {
          // Update the password
          passwords[user.email] = newPassword;
          return {};
        } catch (error) {
          return { error: error instanceof Error ? error : new Error('Unknown error') };
        }
      },
      getUsers: () => {
        // Refresh user stats before returning users
        get().refreshUserStats();
        return [...users];
      },
      addUser: (userData, password) => {
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
          return false;
        }

        const newUser: User = {
          ...userData,
          id: String(users.length + 1),
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

        users.push(newUser);
        passwords[userData.email] = password;
        return true;
      },
      updateUserRole: (userId, role) => {
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        
        users[index].role = role;
        return true;
      },
      getUserById: (userId) => {
        return users.find(u => u.id === userId);
      },
      getTopUser: () => {
        if (users.length === 0) return undefined;
        return [...users].sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal)[0];
      },
      getTopUserOfMonth: () => {
        if (users.length === 0) return undefined;
        return [...users].sort((a, b) => b.stats.pointsThisMonth - a.stats.pointsThisMonth)[0];
      },
      getUserRanking: () => {
        // Make sure we've refreshed stats before returning rankings
        get().refreshUserStats();
        return [...users].sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal);
      },
      forgotPassword: async (email: string) => {
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
      },
      resetPassword: async (email: string, token: string, newPassword: string) => {
        // Find the token
        const tokenIndex = resetTokens.findIndex(
          (rt) => rt.email === email && rt.token === token && new Date() < rt.expires
        );
        
        if (tokenIndex === -1) {
          // Token not found or expired
          return false;
        }
        
        // Token is valid, update the password
        passwords[email] = newPassword;
        
        // Remove the used token
        resetTokens.splice(tokenIndex, 1);
        
        return true;
      },
      deleteUser: (userId: string) => {
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        
        // Check if trying to delete the current user (shouldn't delete yourself)
        const { user } = get();
        if (user?.id === userId) return false;
        
        // Delete the user
        const deletedUser = users.splice(index, 1)[0];
        
        // Clean up password record
        if (deletedUser.email in passwords) {
          delete passwords[deletedUser.email];
        }
        
        return true;
      },
      refreshUserStats: () => {
        try {
          // Get blog posts from store to calculate real statistics
          const blogStore = useBlogStore.getState();
          const posts = blogStore.posts || []; // Add fallback to empty array if posts is undefined
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          // Calculate statistics for each user
          users.forEach(user => {
            // Get user-authored posts - make sure we handle undefined author
            const userPosts = posts.filter(post => post.author === user.name);
            
            // Count posts
            const postsCount = userPosts.length;
            
            // Sum up total views from all user's posts
            const viewsCount = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
            
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
              if (!post.date) return; // Skip if no date
              
              const postDate = new Date(post.date);
              
              // Only count posts from current month
              if (postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear) {
                // Count contributions from this month
                if (post.author === user.name) {
                  pointsThisMonth += 50; // Points for creating a post this month
                }
                
                // Count views from this month's posts
                if (post.author === user.name) {
                  pointsThisMonth += post.views || 0;
                }
                
                // Count comments from this month
                if (post.comments && Array.isArray(post.comments)) {
                  post.comments.forEach(comment => {
                    if (comment.userId === user.id && comment.date) {
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
        } catch (error) {
          console.error("Error refreshing user stats:", error);
        }
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
