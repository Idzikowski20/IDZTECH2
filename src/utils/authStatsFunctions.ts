import { User, UserStats } from './authTypes';

// Mock function to simulate saving user data to a database
const saveUserToDb = async (user: User): Promise<User> => {
  // Simulate a database save operation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("User data saved to database:", user);
      resolve(user);
    }, 500);
  });
};

// Update user statistics with activity data
export const updateUserStats = async (user: User, activityData: {
  views?: number;
  posts?: number;
  comments?: number;
  likes?: number;
}) => {
  if (user && user.stats) {
    const stats = { ...user.stats };
    
    if (activityData.views) stats.views += activityData.views;
    if (activityData.posts) stats.posts += activityData.posts;
    if (activityData.comments) stats.comments += activityData.comments;
    if (activityData.likes) stats.likes += activityData.likes;
    
    const pointsTotal = calculatePoints(stats);
    stats.pointsTotal = pointsTotal;
    
    // Update monthly points
    const now = new Date();
    const lastUpdated = new Date(stats.lastUpdated);
    const isNewMonth = lastUpdated.getMonth() !== now.getMonth() || 
                      lastUpdated.getFullYear() !== now.getFullYear();
    
    if (isNewMonth) {
      stats.pointsThisMonth = 0; // Reset monthly points on new month
    }
    
    stats.pointsThisMonth += calculatePoints({
      views: activityData.views || 0,
      posts: activityData.posts || 0,
      comments: activityData.comments || 0,
      likes: activityData.likes || 0
    });
    
    stats.lastUpdated = now.toISOString();
    
    // Also update the user model properties if they exist
    if (activityData.posts && user.postsCreated !== undefined) {
      user.postsCreated += activityData.posts;
    }
    if (activityData.views && user.totalViews !== undefined) {
      user.totalViews += activityData.views;
    }
    if (activityData.comments && user.commentsCount !== undefined) {
      user.commentsCount += activityData.comments;
    }
    if (activityData.likes && user.likesCount !== undefined) {
      user.likesCount += activityData.likes;
    }
    
    user.stats = stats;
    
    // Here in a real app, you would save user to the database
    // return saveUserToDb(user);
    
    return user;
  }
  
  return user;
};

// Calculate total points from stats
export const calculatePoints = (stats: {
  views: number;
  posts: number;
  comments: number;
  likes: number;
}): number => {
  return (stats.views * 1) + (stats.posts * 50) + (stats.comments * 10) + (stats.likes * 5);
};

// Mock function to simulate fetching user ranking
export const getUserRanking = async (): Promise<User[]> => {
  // In a real application, this would fetch users from a database
  // and sort them by total points
  
  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      name: 'User One',
      stats: {
        views: 100,
        posts: 10,
        comments: 50,
        likes: 25,
        pointsTotal: 1000,
        pointsThisMonth: 150,
        lastUpdated: new Date().toISOString()
      }
    } as User,
    {
      id: '2',
      email: 'user2@example.com',
      name: 'User Two',
      stats: {
        views: 150,
        posts: 5,
        comments: 75,
        likes: 30,
        pointsTotal: 900,
        pointsThisMonth: 120,
        lastUpdated: new Date().toISOString()
      }
    } as User,
    {
      id: '3',
      email: 'user3@example.com',
      name: 'User Three',
      stats: {
        views: 200,
        posts: 2,
        comments: 100,
        likes: 40,
        pointsTotal: 800,
        pointsThisMonth: 100,
        lastUpdated: new Date().toISOString()
      }
    } as User,
  ];
  
  // Sort users by points (descending)
  return mockUsers.sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal);
};
