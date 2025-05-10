
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock user database
const users: User[] = [
  {
    id: '1',
    email: 'admin@idztech.pl',
    name: 'Admin',
    role: 'admin',
  },
];

// Password map (in a real app, these would be hashed)
const passwords: Record<string, string> = {
  'admin@idztech.pl': 'admin123',
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simple mock login - in a real app, you'd call an API
        const user = users.find((u) => u.email === email);
        
        if (user && passwords[email] === password) {
          set({ user, isAuthenticated: true });
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
    }),
    {
      name: 'auth-storage',
    }
  )
);
