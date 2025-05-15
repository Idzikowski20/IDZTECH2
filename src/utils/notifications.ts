
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Local notifications store
interface Notification {
  id: string;
  title: string; 
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'comment' | 'guest-comment';
  target_id?: string;
  target_type?: string;
  created_at: string;
  is_read: boolean;
  user_id?: string;
}

// In-memory store for notifications
let notificationsCache: Notification[] = [];
let unreadCount = 0;

// Load notifications from localStorage on init
try {
  const stored = localStorage.getItem('notifications');
  if (stored) {
    notificationsCache = JSON.parse(stored);
    unreadCount = notificationsCache.filter(n => !n.is_read).length;
  }
} catch (e) {
  console.error("Error loading notifications from localStorage:", e);
}

// Save notifications to localStorage
const saveNotifications = () => {
  try {
    localStorage.setItem('notifications', JSON.stringify(notificationsCache));
  } catch (e) {
    console.error("Error saving notifications to localStorage:", e);
  }
};

// Helper to create a new notification
export const addNotification = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' | 'comment' | 'guest-comment' = 'info',
  target_id?: string,
  target_type?: string,
  user_id?: string
) => {
  const newNotification: Notification = {
    id: uuidv4(),
    title,
    message,
    type,
    target_id,
    target_type,
    created_at: new Date().toISOString(),
    is_read: false,
    user_id
  };
  
  // Add to in-memory store
  notificationsCache = [newNotification, ...notificationsCache];
  unreadCount++;
  
  // Save to localStorage
  saveNotifications();
  
  // Try to save to Supabase if user is admin
  try {
    saveNotificationToSupabase(newNotification);
  } catch (e) {
    console.error("Error saving notification to Supabase:", e);
  }
  
  return newNotification;
};

// Save notification to Supabase
const saveNotificationToSupabase = async (notification: Notification) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        target_id: notification.target_id,
        target_type: notification.target_type,
        created_at: notification.created_at,
        is_read: notification.is_read,
        user_id: notification.user_id
      });
      
    if (error) {
      console.error("Error saving notification to Supabase:", error);
    }
  } catch (e) {
    console.error("Error in saveNotificationToSupabase:", e);
  }
};

// Fetch notifications from both localStorage and Supabase
export const fetchNotifications = async () => {
  try {
    // Get notifications from Supabase
    const { data: supabaseNotifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    if (supabaseNotifications) {
      // Merge with local notifications by unique ID
      const allNotifications = [...notificationsCache];
      
      // Add Supabase notifications that aren't in the local cache
      supabaseNotifications.forEach(notification => {
        if (!allNotifications.some(n => n.id === notification.id)) {
          allNotifications.push(notification);
        }
      });
      
      // Sort by created_at descending
      allNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Update local cache
      notificationsCache = allNotifications;
      unreadCount = allNotifications.filter(n => !n.is_read).length;
      saveNotifications();
    }
    
    return notificationsCache;
  } catch (e) {
    console.error("Error fetching notifications:", e);
    return notificationsCache; // Return local cache if fetch fails
  }
};

// Mark notification as read
export const markAsRead = async (id: string) => {
  try {
    // Update local cache
    notificationsCache = notificationsCache.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    );
    unreadCount = notificationsCache.filter(n => !n.is_read).length;
    saveNotifications();
    
    // Update in Supabase
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
      
    if (error) {
      console.error("Error marking notification as read in Supabase:", error);
    }
    
    return notificationsCache;
  } catch (e) {
    console.error("Error marking notification as read:", e);
    return notificationsCache;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    // Update local cache
    notificationsCache = notificationsCache.map(n => ({ ...n, is_read: true }));
    unreadCount = 0;
    saveNotifications();
    
    // Update in Supabase
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);
      
    if (error) {
      console.error("Error marking all notifications as read in Supabase:", error);
    }
    
    return notificationsCache;
  } catch (e) {
    console.error("Error marking all notifications as read:", e);
    return notificationsCache;
  }
};

// Delete notification
export const deleteNotification = async (id: string) => {
  try {
    // Remove from local cache
    const notificationToDelete = notificationsCache.find(n => n.id === id);
    notificationsCache = notificationsCache.filter(n => n.id !== id);
    if (notificationToDelete && !notificationToDelete.is_read) {
      unreadCount--;
    }
    saveNotifications();
    
    // Remove from Supabase
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting notification from Supabase:", error);
    }
    
    return notificationsCache;
  } catch (e) {
    console.error("Error deleting notification:", e);
    return notificationsCache;
  }
};

// Add guest comment request notification
export const addGuestCommentRequest = (postId: string, postTitle: string, guestName: string, comment: string) => {
  return addNotification(
    'Nowy komentarz gościa',
    `${guestName} dodał komentarz do posta "${postTitle}": "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
    'guest-comment',
    postId,
    'blog_post'
  );
};

// Approve guest comment
export const approveGuestComment = async (commentId: string, postId: string, guestName: string, commentContent: string) => {
  try {
    // Insert comment to blog_comments table
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        post_id: postId,
        guest_name: guestName,
        content: commentContent,
        status: 'approved'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Delete the notification
    await deleteNotification(commentId);
    
    return data;
  } catch (e) {
    console.error("Error approving guest comment:", e);
    return null;
  }
};

// Reject guest comment
export const rejectGuestComment = async (commentId: string) => {
  try {
    // Just delete the notification
    await deleteNotification(commentId);
    return true;
  } catch (e) {
    console.error("Error rejecting guest comment:", e);
    return false;
  }
};

// Custom hook to use notifications
export const useNotifications = () => {
  return {
    notifications: notificationsCache,
    unreadCount,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addGuestCommentRequest,
    approveGuestComment,
    rejectGuestComment
  };
};
