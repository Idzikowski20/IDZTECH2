import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth, db } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { collection, getDocs, query, where, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Define user type with extended profile
export type ExtendedUserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  role?: string;
};

// Dodajemy interfejs dla danych użytkownika w Firestore
interface UserDocumentData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: any; // serverTimestamp()
  createdAt?: any; // serverTimestamp()
  role?: string;
  [key: string]: any; // Dodajemy indeks sygnatury dla Firestore
}

// Auth context type
type AuthContextType = {
  user: (User & ExtendedUserProfile) | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Funkcja do tworzenia/aktualizowania dokumentu użytkownika
  const createOrUpdateUserDocument = async (firebaseUser: User): Promise<UserDocumentData> => {
    if (!firebaseUser) return null;

    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    const userData: UserDocumentData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      lastLogin: serverTimestamp(),
    };

    if (!userSnap.exists()) {
      const newUserData = {
        ...userData,
        createdAt: serverTimestamp(),
        role: "user",
      };
      await setDoc(userRef, newUserData);
      return newUserData;
    } else {
      await updateDoc(userRef, userData);
      const existingData = userSnap.data() as UserDocumentData;
      return { ...userData, role: existingData.role };
    }
  };

  useEffect(() => {
    console.log("Setting up Firebase auth listener");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "User logged in" : "User logged out");
      
      if (firebaseUser) {
        try {
          // Tworzymy/aktualizujemy dokument użytkownika
          const userData = await createOrUpdateUserDocument(firebaseUser);
          
          const extendedUser = {
            ...firebaseUser,
            id: firebaseUser.uid,
            name: firebaseUser.displayName,
            role: userData.role || 'user',
            ...userData
          } as User & ExtendedUserProfile;
          
          setUser(extendedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error handling user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      toast.success("Zalogowano pomyślnie", {
        description: "Witamy z powrotem!"
      });
      
      return { data: userCredential, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast.error("Błąd logowania", {
        description: error.message || "Nieprawidłowy email lub hasło"
      });
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      toast.success("Konto utworzone", {
        description: "Możesz się teraz zalogować"
      });
      
      return { data: userCredential, error: null };
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      toast.error("Błąd rejestracji", {
        description: error.message
      });
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Wylogowano pomyślnie");
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email został wysłany", {
        description: "Sprawdź swoją skrzynkę pocztową, aby zresetować hasło"
      });
      return { error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Błąd resetowania hasła", {
        description: "Nie udało się wysłać emaila z resetowaniem hasła"
      });
      return { error };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently logged in");
      }
      
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      toast.success("Hasło zaktualizowane", {
        description: "Twoje hasło zostało pomyślnie zmienione"
      });
      return { error: null };
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Błąd aktualizacji hasła", {
        description: "Nie udało się zmienić hasła"
      });
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
