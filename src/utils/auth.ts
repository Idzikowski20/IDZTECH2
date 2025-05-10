import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user' | 'moderator' | 'blogger';

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
  getUsers: () => User[];
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'postsCreated' | 'totalViews'>, password: string) => boolean;
  updateUserRole: (userId: string, role: UserRole) => boolean;
  getUserById: (userId: string) => User | undefined;
  getTopUser: () => User | undefined;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
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
    totalViews: 750,
    createdAt: '2023-01-01T12:00:00Z',
    lastLogin: new Date().toISOString(),
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
    totalViews: 320,
    createdAt: '2023-05-15T10:30:00Z',
    lastLogin: '2023-05-20T14:22:00Z',
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
    totalViews: 940,
    createdAt: '2023-06-10T09:15:00Z',
    lastLogin: '2023-06-25T16:40:00Z',
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
      getUsers: () => {
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
        return [...users].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))[0];
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
        
        // W prawdziwej aplikacji wywołalibyśmy API do wysyłki maila
        // Dla celów demonstracyjnych wyświetlamy link do resetu w konsoli i w alercie
        console.log('Password reset requested for:', email);
        console.log('Reset link:', `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
        
        // Dla wszystkich użytkowników pokazujemy alert z linkiem (symulacja maila)
        alert(`Link do resetu hasła: ${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
        
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
