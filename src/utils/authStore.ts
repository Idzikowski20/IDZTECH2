// Main authentication store using zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole } from './authTypes';
import { users, passwords, resetTokens } from './authUtils';
import { refreshUserStats, getUserRanking, getTopUser, getTopUserOfMonth } from './authStatsFunctions';
import { 
  fetchSupabaseUsers, 
  supabaseSignIn, 
  supabaseSignUp, 
  supabaseSignOut, 
  supabaseCreateUser, 
  supabaseUpdateUserRole, 
  supabaseDeleteUser, 
  supabaseResetPassword, 
  supabaseUpdatePassword 
} from './authSupabaseIntegration';

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      rememberMe: false,
      loading: false,
      
      fetchSupabaseUsers,
      
      // Adding login function as an alias to signIn to match the AuthState interface
      login: async (email: string, password: string, remember = false) => {
        // Just delegate to the existing signIn function
        return await get().signIn(email, password, remember);
      },
      
      signIn: async (email: string, password: string, remember = false) => {
        // Add loading state
        set({ loading: true });
        
        try {
          // Try to login with Supabase first
          const { data: supaData, error: supaError } = await supabaseSignIn(email, password);

          if (supaData?.user) {
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
            
            set({ user, isAuthenticated: true, rememberMe: remember, loading: false });
            return true;
          } else if (supaError) {
            // Fallback to mock login system
            const mockUser = users.find((u) => u.email === email);
            
            if (mockUser && passwords[email] === password) {
              mockUser.lastLogin = new Date().toISOString();
              set({ user: mockUser, isAuthenticated: true, rememberMe: remember, loading: false });
              return true;
            }
          }
          
          set({ loading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ loading: false });
          return false;
        }
      },
      
      register: async (email: string, name: string, password: string) => {
        try {
          // Try to register with Supabase
          const { data: supaData, error: supaError } = await supabaseSignUp(email, password, { name });

          if (supaData?.user) {
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
        supabaseSignOut();
      },
      
      signOut: () => {
        set({ user: null, isAuthenticated: false });
        supabaseSignOut();
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
          const { data, error } = await supabaseCreateUser(userData.email, password, {
            name: userData.name,
            last_name: userData.lastName,
            role: userData.role
          });

          if (error) {
            console.error("Error creating Supabase user:", error);
            return false;
          }

          if (data?.user) {
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
          const { error } = await supabaseUpdateUserRole(userId, role);

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
      
      getTopUser,
      getTopUserOfMonth,
      getUserRanking,
      
      forgotPassword: async (email: string) => {
        try {
          // Try with Supabase first
          const { error } = await supabaseResetPassword(email);
          
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
          const { error } = await supabaseUpdatePassword(newPassword);
          
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
          const { error } = await supabaseDeleteUser(userId);
          
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
      
      refreshUserStats,
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

// Re-export types for easier imports
export type { User, UserRole, UserStats, AuthState } from './authTypes';
