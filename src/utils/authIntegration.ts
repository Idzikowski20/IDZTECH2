
import { User } from './authTypes';
import { sanityClient, fetchSanityData } from '@/lib/sanity';
import { calculatePoints } from './authUtils';

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
      last_sign_in: user.last_sign_in || null,
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
      last_sign_in: result.last_sign_in || null,
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
    
    // Use type assertion to handle the returned Sanity document
    const sanityUser = result as any;
    
    return {
      id: sanityUser._id,
      name: sanityUser.name,
      email: sanityUser.email,
      role: sanityUser.role,
      lastName: sanityUser.lastName,
      profilePicture: sanityUser.profilePicture ? 
        sanityUser.profilePicture.asset._ref.replace('image-', '').replace('-jpg', '.jpg') : 
        undefined,
      jobTitle: sanityUser.jobTitle,
      created_at: sanityUser.created_at,
      // Handle potentially missing last_sign_in property
      last_sign_in: null, // New users won't have a last_sign_in value
      stats: sanityUser.stats
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

// Funkcja do dodania komentarza do posta
export const addComment = async (postId: string, commentData: {
  author?: { _ref: string }; 
  text: string;
  guestName?: string;
}): Promise<boolean> => {
  try {
    const comment = {
      ...commentData,
      postedAt: new Date().toISOString()
    };
    
    await sanityClient
      .patch(postId)
      .setIfMissing({ comments: [] })
      .append('comments', [comment])
      .commit();
      
    // If comment has author, update their stats
    if (commentData.author?._ref) {
      const userId = commentData.author._ref;
      
      // Get current user stats
      const query = `*[_type == "user" && _id == $userId][0].stats`;
      const currentStats = await fetchSanityData(query, { userId });
      
      if (currentStats) {
        const commentCount = (currentStats.comments || 0) + 1;
        const pointsTotal = calculatePoints(
          currentStats.views || 0,
          currentStats.posts || 0,
          commentCount,
          currentStats.likes || 0
        );
        
        await sanityClient
          .patch(userId)
          .set({
            stats: {
              ...currentStats,
              comments: commentCount,
              pointsTotal,
              pointsThisMonth: Math.round(pointsTotal * 0.2), // Simplified monthly points
              lastUpdated: new Date().toISOString()
            }
          })
          .commit();
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error adding comment:", error);
    return false;
  }
};

// Funkcja do dodania polubienia do posta
export const addLike = async (postId: string, userId: string | null): Promise<boolean> => {
  try {
    if (userId) {
      // Check if user already liked the post
      const query = `*[_type == "blogPost" && _id == $postId][0].likes`;
      const likes = await fetchSanityData(query, { postId });
      
      if (likes && likes.some((like: any) => like._ref === userId)) {
        // User already liked this post
        return false;
      }
      
      // Add user like
      await sanityClient
        .patch(postId)
        .setIfMissing({ likes: [] })
        .append('likes', [{ _ref: userId, _type: 'reference' }])
        .commit();
        
      // Update user stats
      const userQuery = `*[_type == "user" && _id == $userId][0].stats`;
      const userStats = await fetchSanityData(userQuery, { userId });
      
      if (userStats) {
        const likeCount = (userStats.likes || 0) + 1;
        const pointsTotal = calculatePoints(
          userStats.views || 0,
          userStats.posts || 0,
          userStats.comments || 0,
          likeCount
        );
        
        await sanityClient
          .patch(userId)
          .set({
            stats: {
              ...userStats,
              likes: likeCount,
              pointsTotal,
              pointsThisMonth: Math.round(pointsTotal * 0.2), // Simplified monthly points
              lastUpdated: new Date().toISOString()
            }
          })
          .commit();
      }
    } else {
      // Add guest like
      const guestId = `guest-${Date.now()}`;
      await sanityClient
        .patch(postId)
        .setIfMissing({ guestLikes: [] })
        .append('guestLikes', [guestId])
        .commit();
    }
    
    return true;
  } catch (error) {
    console.error("Error adding like:", error);
    return false;
  }
};

// Funkcja do tworzenia nowego użytkownika z dodatkową kontrolą nad hasłem
export const createUser = async (userData: {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  role?: string;
  jobTitle?: string;
}): Promise<User | null> => {
  try {
    // W rzeczywistym systemie tutaj hashjemy hasło i przechowujemy hash
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Tworzenie dokumentu użytkownika w Sanity
    const result = await sanityClient.create({
      _type: 'user',
      name: userData.name,
      lastName: userData.lastName || '',
      email: userData.email,
      role: userData.role || 'user',
      jobTitle: userData.jobTitle || '',
      created_at: new Date().toISOString(),
      // Dodanie pustego obiektu profilePicture bez pliku
      profilePicture: undefined,
      // Inicjowanie statystyk użytkownika
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
    
    // W rzeczywistym systemie tutaj zapisalibyśmy hash hasła w bezpiecznym miejscu
    
    // Use type assertion to handle the returned Sanity document
    const sanityUser = result as any;
    
    return {
      id: sanityUser._id,
      name: sanityUser.name,
      email: sanityUser.email,
      role: sanityUser.role,
      lastName: sanityUser.lastName,
      jobTitle: sanityUser.jobTitle,
      created_at: sanityUser.created_at,
      last_sign_in: null,
      stats: sanityUser.stats
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};
