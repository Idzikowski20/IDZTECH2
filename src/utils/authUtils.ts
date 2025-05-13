
import { users } from './authTypes';
import { fetchSanityData, sanityClient } from '@/lib/sanity';

export const formatUserData = (userData: any) => {
  // Konwersja danych z Sanity do formatu używanego w aplikacji
  return {
    id: userData._id,
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role,
    profilePicture: userData.profilePicture ? 
      userData.profilePicture.asset._ref : undefined,
    jobTitle: userData.jobTitle,
    created_at: userData.created_at,
    last_sign_in: userData.last_sign_in || null,
    stats: userData.stats
  };
};

// Function to authenticate a user using Sanity
export const authenticateUser = async (email: string, password: string) => {
  try {
    // In a real implementation, you would validate the password securely
    // Here we're just checking if the user exists
    const query = `*[_type == "user" && email == $email][0]`;
    const user = await fetchSanityData(query, { email });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Update last sign in time
    await sanityClient
      .patch(user._id)
      .set({ last_sign_in: new Date().toISOString() })
      .commit();
    
    // Return user data
    return { 
      success: true, 
      user: formatUserData(user)
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { success: false, error: 'Authentication failed' };
  }
};

export const calculateUserActivity = async () => {
  try {
    // Fetch activity data from Sanity
    const query = `*[_type == "user"] {
      stats {
        posts,
        comments,
        likes
      }
    }`;
    
    const users = await fetchSanityData(query);
    
    if (!users || users.length === 0) return 0;
    
    // Obliczanie średniej aktywności użytkowników
    let totalActivity = 0;
    
    users.forEach((user: any) => {
      if (user.stats) {
        const posts = user.stats.posts || 0;
        const comments = user.stats.comments || 0;
        const likes = user.stats.likes || 0;
        
        totalActivity += posts + comments + likes;
      }
    });
    
    return totalActivity / users.length;
  } catch (error) {
    console.error("Error calculating user activity:", error);
    return 0;
  }
};

export const getUserAuthStats = async () => {
  try {
    // Pobieramy statystyki użytkowników z Sanity
    const query = `{
      "totalUsers": count(*[_type == "user"]),
      "activeUsers": count(*[_type == "user" && defined(last_sign_in) && dateTime(last_sign_in) > dateTime(now()) - 60*60*24*30]),
      "newUsers": count(*[_type == "user" && dateTime(created_at) > dateTime(now()) - 60*60*24*30]),
      "totalLogins": count(*[_type == "user" && defined(last_sign_in)])
    }`;
    
    const stats = await fetchSanityData(query);
    
    if (!stats) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        totalLogins: 0
      };
    }
    
    return {
      totalUsers: stats.totalUsers || 0,
      activeUsers: stats.activeUsers || 0,
      newUsers: stats.newUsers || 0,
      totalLogins: stats.totalLogins || 0
    };
  } catch (error) {
    console.error("Error fetching user auth stats:", error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      totalLogins: 0
    };
  }
};

// Function to handle user interaction with content (likes, comments)
export const handleUserInteraction = async (userId: string, interactionType: 'view' | 'post' | 'comment' | 'like', increment: number = 1) => {
  try {
    // First, get current stats
    const query = `*[_type == "user" && _id == $userId][0].stats`;
    const currentStats = await fetchSanityData(query, { userId });
    
    if (!currentStats) {
      return false;
    }
    
    // Create updated stats object
    const updatedStats = { ...currentStats };
    
    // Update the specific interaction count
    switch (interactionType) {
      case 'view':
        updatedStats.views = (updatedStats.views || 0) + increment;
        break;
      case 'post':
        updatedStats.posts = (updatedStats.posts || 0) + increment;
        break;
      case 'comment':
        updatedStats.comments = (updatedStats.comments || 0) + increment;
        break;
      case 'like':
        updatedStats.likes = (updatedStats.likes || 0) + increment;
        break;
    }
    
    // Calculate new point totals
    updatedStats.pointsTotal = calculatePoints(
      updatedStats.views || 0,
      updatedStats.posts || 0,
      updatedStats.comments || 0,
      updatedStats.likes || 0
    );
    
    // Update points this month (simplified approach)
    // In a real implementation, you'd track monthly points more accurately
    updatedStats.pointsThisMonth = Math.round(updatedStats.pointsTotal * 0.2); // Example: 20% of total
    updatedStats.lastUpdated = new Date().toISOString();
    
    // Update user stats in Sanity
    await sanityClient
      .patch(userId)
      .set({ stats: updatedStats })
      .commit();
    
    return true;
  } catch (error) {
    console.error(`Error handling ${interactionType} interaction:`, error);
    return false;
  }
};

// Funkcja do obliczania punktów użytkownika
export const calculatePoints = (views: number, posts: number, comments: number, likes: number): number => {
  return views + (posts * 50) + (comments * 10) + (likes * 5);
};

// Export users array
export { users };
