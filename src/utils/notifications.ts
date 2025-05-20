
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Notification types
export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'comment' 
  | 'guest-comment'
  | 'post_created'
  | 'post_edited'
  | 'post_deleted'
  | 'comment_added'
  | 'like_added'
  | 'approval_request'
  | 'approval_accepted'
  | 'approval_rejected';

export type NotificationStatus = 'pending' | 'approved' | 'rejected' | 'unread' | 'read';

// Local notifications store
export interface Notification {
  id: string;
  title: string; 
  message: string;
  type: NotificationType;
  target_id?: string;
  target_type?: string;
  created_at: string;
  is_read: boolean;
  user_id?: string;
  status?: NotificationStatus;
  comment?: string;
  fromUserName?: string;
  createdAt?: string; // Alias for created_at for UI compatibility
}

// Define Supabase notification structure to match the database columns
interface SupabaseNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  target_id?: string;
  target_type?: string;
  created_at: string;
  is_read: boolean;
  user_id?: string;
  status?: string;
  comment?: string;
  fromUserName?: string;
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
  type: NotificationType = 'info',
  target_id?: string,
  target_type?: string,
  user_id?: string
): Notification => {
  const newNotification: Notification = {
    id: uuidv4(),
    title,
    message,
    type,
    target_id,
    target_type,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(), // Add alias for UI compatibility
    is_read: false,
    user_id,
    status: type.includes('approval') ? 'pending' : 'unread'
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

// Function to update notification status
export const updateNotificationStatus = async (id: string, status: NotificationStatus, comment?: string) => {
  try {
    // Update local cache
    notificationsCache = notificationsCache.map(n => 
      n.id === id ? { ...n, status, comment } : n
    );
    
    saveNotifications();
    
    // Update in Supabase
    const { error } = await supabase
      .from('notifications')
      .update({ status, comment } as Partial<SupabaseNotification>)
      .eq('id', id);
      
    if (error) {
      console.error("Error updating notification status in Supabase:", error);
    }
    
    return notificationsCache;
  } catch (e) {
    console.error("Error updating notification status:", e);
    return notificationsCache;
  }
};

// Save notification to Supabase
const saveNotificationToSupabase = async (notification: Notification) => {
  try {
    const supabaseNotification: SupabaseNotification = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      target_id: notification.target_id,
      target_type: notification.target_type,
      created_at: notification.created_at,
      is_read: notification.is_read,
      user_id: notification.user_id,
      status: notification.status,
      comment: notification.comment,
      fromUserName: notification.fromUserName
    };
      
    const { error } = await supabase
      .from('notifications')
      .insert(supabaseNotification);
      
    if (error) {
      console.error("Error saving notification to Supabase:", error);
    }
  } catch (e) {
    console.error("Error in saveNotificationToSupabase:", e);
  }
};

// Fetch notifications from both localStorage and Supabase
export const fetchNotifications = async (): Promise<Notification[]> => {
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
      // Process notifications to ensure they have all fields
      const processedNotifications = supabaseNotifications.map(notification => {
        const supaNotif = notification as unknown as SupabaseNotification;
        // Cast to our Notification type with additional properties
        const processedNotification: Notification = {
          ...supaNotif as unknown as Notification,
          createdAt: supaNotif.created_at,
          type: supaNotif.type as NotificationType,
          status: (supaNotif.status as NotificationStatus) || 
                 (supaNotif.type.includes('approval') ? 'pending' : 'unread')
        };
        return processedNotification;
      });
      
      // Merge with local notifications by unique ID
      const allNotifications = [...notificationsCache];
      
      // Add Supabase notifications that aren't in the local cache
      processedNotifications.forEach(notification => {
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
export const markAsRead = async (id: string): Promise<Notification[]> => {
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
export const markAllAsRead = async (): Promise<Notification[]> => {
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
export const deleteNotification = async (id: string): Promise<Notification[]> => {
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

// Add comment notification
export const addCommentNotification = async (
  postId: string, 
  postTitle: string, 
  userName: string,
  userId: string
): Promise<Notification> => {
  return addNotification(
    'Nowy komentarz',
    `${userName} dodał komentarz do posta "${postTitle}"`,
    'comment',
    postId,
    'blog_post',
    userId
  );
};

// Add guest comment request notification
export const addGuestCommentRequest = (postId: string, postTitle: string, guestName: string, comment: string): Notification => {
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

// Store state type
type State = {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: typeof fetchNotifications;
  addNotification: typeof addNotification;
  markAsRead: typeof markAsRead;
  markAllAsRead: typeof markAllAsRead;
  deleteNotification: typeof deleteNotification;
  addGuestCommentRequest: typeof addGuestCommentRequest;
  approveGuestComment: typeof approveGuestComment;
  rejectGuestComment: typeof rejectGuestComment;
  addCommentNotification: typeof addCommentNotification;
  updateNotificationStatus: typeof updateNotificationStatus;
};

// Create a proper store that allows for getState and setState
const createStore = <T extends object>(initialState: T) => {
  let state = initialState;
  const listeners: (() => void)[] = [];

  const getState = () => state;

  const setState = (partial: Partial<T>) => {
    state = { ...state, ...partial };
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  };

  const useStore = () => {
    return { ...state };
  };

  // Make these methods accessible via the useStore function
  const storeWithMethods = Object.assign(useStore, {
    getState,
    setState,
    subscribe
  });

  return storeWithMethods;
};

// Initialize store with state
export const useNotifications = createStore<State>({
  notifications: notificationsCache,
  unreadCount,
  fetchNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  addGuestCommentRequest,
  approveGuestComment,
  rejectGuestComment,
  addCommentNotification,
  updateNotificationStatus
});

// Export a function to initialize the notifications
export const initializeNotifications = async () => {
  await fetchNotifications();
};
