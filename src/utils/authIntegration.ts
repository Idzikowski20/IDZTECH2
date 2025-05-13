
import { User } from './authTypes';
import { sanityClient, fetchSanityData } from '@/lib/sanity';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const query = `*[_type == "user"] {
      _id,
      name,
      lastName,
      email,
      role,
      profilePicture,
      jobTitle,
      created_at,
      last_sign_in,
      stats {
        views,
        posts,
        comments,
        likes,
        pointsTotal,
        pointsThisMonth,
        lastUpdated
      }
    }`;
    
    const users = await fetchSanityData(query);
    
    if (!users) return [];
    
    // Mapowanie danych z Sanity do formatu używanego w aplikacji
    return users.map((user: any) => ({
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture ? 
        user.profilePicture.asset._ref.replace('image-', '').replace('-jpg', '.jpg') : 
        undefined,
      jobTitle: user.jobTitle,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in,
      stats: user.stats
    }));
  } catch (error) {
    console.error("Error fetching users from Sanity:", error);
    return [];
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  return fetchUsers();
};

export const updateUserRole = async (userId: string, role: string): Promise<User | null> => {
  try {
    // Aktualizacja roli użytkownika w Sanity
    const result = await sanityClient
      .patch(userId)
      .set({ role })
      .commit();
      
    return {
      id: result._id,
      name: result.name,
      email: result.email,
      role: result.role,
      // Konwertujemy inne pola z formatu Sanity do naszego modelu User
      lastName: result.lastName,
      profilePicture: result.profilePicture ? 
        result.profilePicture.asset._ref.replace('image-', '').replace('-jpg', '.jpg') : 
        undefined,
      jobTitle: result.jobTitle,
      created_at: result.created_at,
      last_sign_in: result.last_sign_in,
      stats: result.stats
    };
  } catch (error) {
    console.error("Error updating user role in Sanity:", error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Usunięcie użytkownika z Sanity
    await sanityClient.delete(userId);
    return true;
  } catch (error) {
    console.error("Error deleting user from Sanity:", error);
    return false;
  }
};

// Dodanie użytkownika do Sanity
export const addUser = async (userData: Partial<User>, password: string): Promise<User | null> => {
  try {
    // Nie przechowujemy hasła w Sanity (będzie przechowywane w osobnym systemie autoryzacji)
    // Tworzymy dokument użytkownika w Sanity
    const result = await sanityClient.create({
      _type: 'user',
      name: userData.name || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      role: userData.role || 'user',
      profilePicture: userData.profilePicture ? { 
        _type: 'image',
        asset: {
          _ref: `image-${userData.profilePicture}`,
          _type: 'reference'
        }
      } : undefined,
      jobTitle: userData.jobTitle || '',
      created_at: new Date().toISOString(),
      stats: {
        views: 0,
        posts: 0,
        comments: 0,
        likes: 0,
        pointsTotal: 0,
        pointsThisMonth: 0,
        lastUpdated: new Date().toISOString()
      }
    });
    
    // Zwracamy utworzonego użytkownika w formacie naszego modelu
    return {
      id: result._id,
      name: result.name,
      email: result.email,
      role: result.role,
      lastName: result.lastName,
      profilePicture: result.profilePicture ? 
        result.profilePicture.asset._ref.replace('image-', '').replace('-jpg', '.jpg') : 
        undefined,
      jobTitle: result.jobTitle,
      created_at: result.created_at,
      // Use optional chaining for properties that might not exist
      last_sign_in: result.last_sign_in || null,
      stats: result.stats
    };
  } catch (error) {
    console.error("Error adding user to Sanity:", error);
    return null;
  }
};

// Funkcja do aktualizacji statystyk użytkownika
export const updateUserStats = async (userId: string, stats: any): Promise<boolean> => {
  try {
    await sanityClient
      .patch(userId)
      .set({
        stats: {
          ...stats,
          lastUpdated: new Date().toISOString()
        }
      })
      .commit();
    return true;
  } catch (error) {
    console.error("Error updating user stats:", error);
    return false;
  }
};
