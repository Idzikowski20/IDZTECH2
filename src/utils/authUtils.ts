
import { users } from './authTypes';
import { fetchSanityData } from '@/lib/sanity';

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
    last_sign_in: userData.last_sign_in,
    stats: userData.stats
  };
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
      "newUsers": count(*[_type == "user" && dateTime(created_at) > dateTime(now()) - 60*60*24*30])
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
    
    // Dla totalLogins możemy użyć innego zapytania lub wartości zastępczej
    return {
      totalUsers: stats.totalUsers || 0,
      activeUsers: stats.activeUsers || 0,
      newUsers: stats.newUsers || 0,
      totalLogins: 0 // To pole może być zastąpione innym zapytaniem w przyszłości
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

// Funkcja do obliczania punktów użytkownika
export const calculatePoints = (views: number, posts: number, comments: number, likes: number): number => {
  return views + (posts * 50) + (comments * 10) + (likes * 5);
};

// Export users array
export { users };
