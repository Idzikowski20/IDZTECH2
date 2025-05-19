import { useState, useEffect } from 'react';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user && user.uid === userId) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.uid === userId ? { ...user, ...updates } : user
        )
      );
    } catch (err) {
      console.error('Error updating user:', err);
      throw new Error('Failed to update user');
    }
  };

  return {
    users,
    loading,
    error,
    updateUserProfile,
    refreshUsers: fetchUsers
  };
} 