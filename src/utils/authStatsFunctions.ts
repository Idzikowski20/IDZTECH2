
// Functions related to user statistics
import { User } from './authTypes';
import { useBlogStore } from './blog';
import { users } from './authUtils';
import { calculatePoints } from './authUtils';

export const refreshUserStats = (): void => {
  // Get blog posts from store to calculate real statistics
  const blogStore = useBlogStore.getState();
  const posts = blogStore.posts || []; // Add fallback to empty array if posts is undefined
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Calculate statistics for each user
  users.forEach(user => {
    // Get user-authored posts
    const userPosts = posts.filter(post => post.author === user.name);
    
    // Count posts
    const postsCount = userPosts.length;
    
    // Sum up total views from all user's posts
    const viewsCount = userPosts.reduce((sum, post) => sum + post.views, 0);
    
    // Count comments made by this user (across all posts)
    const commentsCount = posts.reduce((sum, post) => {
      // Check if post.comments exists before trying to filter it
      return sum + (post.comments && Array.isArray(post.comments) 
        ? post.comments.filter(comment => comment.userId === user.id).length 
        : 0);
    }, 0);
    
    // Count likes given by this user (across all posts)
    const likesCount = posts.reduce((sum, post) => {
      // Check if post.likes exists before trying to check if it includes user.id
      return sum + (post.likes && Array.isArray(post.likes) 
        ? (post.likes.includes(user.id) ? 1 : 0)
        : 0);
    }, 0);
    
    // Calculate monthly stats
    let pointsThisMonth = 0;
    posts.forEach(post => {
      const postDate = new Date(post.date);
      
      // Only count posts from current month
      if (postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear) {
        // Count contributions from this month
        if (post.author === user.name) {
          pointsThisMonth += 50; // Points for creating a post this month
        }
        
        // Count views from this month's posts
        if (post.author === user.name) {
          pointsThisMonth += post.views;
        }
        
        // Count comments from this month
        if (post.comments && Array.isArray(post.comments)) {
          post.comments.forEach(comment => {
            if (comment.userId === user.id) {
              const commentDate = new Date(comment.date);
              if (commentDate.getMonth() === currentMonth && commentDate.getFullYear() === currentYear) {
                pointsThisMonth += 10;
              }
            }
          });
        }
        
        // Count likes from this month
        if (post.likes && Array.isArray(post.likes) && post.likes.includes(user.id)) {
          pointsThisMonth += 5;
        }
      }
    });
    
    // Calculate total points
    const pointsTotal = calculatePoints(viewsCount, postsCount, commentsCount, likesCount);
    
    // Update user stats
    user.postsCreated = postsCount;
    user.totalViews = viewsCount;
    user.commentsCount = commentsCount;
    user.likesCount = likesCount;
    user.stats = {
      views: viewsCount,
      posts: postsCount,
      comments: commentsCount,
      likes: likesCount,
      pointsTotal: pointsTotal,
      pointsThisMonth: pointsThisMonth,
      lastUpdated: new Date().toISOString()
    };
  });
};

export const getTopUser = async (): Promise<User | undefined> => {
  if (users.length === 0) return undefined;
  return [...users].sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal)[0];
};

export const getTopUserOfMonth = async (): Promise<User | undefined> => {
  if (users.length === 0) return undefined;
  return [...users].sort((a, b) => b.stats.pointsThisMonth - a.stats.pointsThisMonth)[0];
};

export const getUserRanking = async (): Promise<User[]> => {
  return [...users].sort((a, b) => b.stats.pointsTotal - a.stats.pointsTotal);
};
