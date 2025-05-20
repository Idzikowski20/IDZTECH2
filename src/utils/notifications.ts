
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 
  | 'post_created' 
  | 'post_edited' 
  | 'post_deleted' 
  | 'user_edited'
  | 'approval_request'
  | 'approval_accepted'
  | 'approval_rejected'
  | 'comment_added'
  | 'like_added'
  | 'info'
  | 'error'
  | 'success'
  | 'warning';

export type NotificationStatus = 'pending' | 'approved' | 'rejected' | 'unread' | 'read';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  status: NotificationStatus;
  fromUserId?: string;
  fromUserName?: string;
  targetId?: string; // ID of post, user, etc. that the notification is about
  targetType?: string; // Type of target: "post", "user", etc.
  comment?: string; // Admin feedback in case of rejection
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'> & {status?: NotificationStatus}) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateNotificationStatus: (id: string, status: NotificationStatus, comment?: string) => void;
  getNotificationsForUser: (userId: string) => Notification[];
  deleteNotification: (id: string) => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotifications = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      fetchNotifications: async () => {
        try {
          console.log("Fetching notifications from Supabase...");
          
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching notifications:', error);
            throw new Error(error.message);
          }

          if (!data) {
            console.log("No notifications found");
            set({ notifications: [], unreadCount: 0 });
            return;
          }
          
          // Transform the Supabase data to match our Notification interface
          const transformedNotifications: Notification[] = data.map(notification => {
            return {
              id: notification.id,
              type: notification.type as NotificationType,
              title: notification.title,
              message: notification.message,
              createdAt: notification.created_at,
              status: notification.is_read ? 'read' as NotificationStatus : 'unread' as NotificationStatus,
              fromUserId: notification.user_id,
              targetId: notification.target_id,
              targetType: notification.target_type,
              fromUserName: 'Użytkownik', // Default name if not provided
            };
          });

          const unreadCount = transformedNotifications.filter(n => n.status === 'unread').length;
          
          set({ 
            notifications: transformedNotifications,
            unreadCount
          });
          
        } catch (error) {
          console.error('Error in fetchNotifications:', error);
          throw error;
        }
      },
      
      addNotification: async (notification) => {
        try {
          const newNotification = {
            type: notification.type,
            title: notification.title,
            message: notification.message,
            user_id: notification.fromUserId,
            target_id: notification.targetId,
            target_type: notification.targetType,
            is_read: notification.status === 'read',
          };

          const { data, error } = await supabase
            .from('notifications')
            .insert([newNotification])
            .select();

          if (error) {
            console.error('Error adding notification:', error);
            return;
          }

          await get().fetchNotifications();
        } catch (error) {
          console.error('Error in addNotification:', error);
        }
      },
      
      markAsRead: async (id) => {
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

          if (error) {
            console.error('Error marking notification as read:', error);
            return;
          }

          await get().fetchNotifications();
        } catch (error) {
          console.error('Error in markAsRead:', error);
        }
      },

      markAllAsRead: async () => {
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false);

          if (error) {
            console.error('Error marking all notifications as read:', error);
            return;
          }

          await get().fetchNotifications();
        } catch (error) {
          console.error('Error in markAllAsRead:', error);
        }
      },
      
      updateNotificationStatus: async (id, status, comment) => {
        try {
          // First update the notification status
          const { error } = await supabase
            .from('notifications')
            .update({ 
              is_read: status === 'read'
            })
            .eq('id', id);

          if (error) {
            console.error('Error updating notification status:', error);
            return;
          }

          // Get the notification that was updated
          const { data: notificationData } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', id)
            .single();

          if (notificationData && 
              (status === 'approved' || status === 'rejected') && 
              notificationData.user_id) {
                
            const responseType = status === 'approved' ? 'approval_accepted' as NotificationType : 'approval_rejected' as NotificationType;
            const responseTitle = status === 'approved' 
              ? 'Prośba zaakceptowana' 
              : 'Prośba odrzucona';
            
            const responseMessage = status === 'approved'
              ? 'Twoja prośba została zaakceptowana'
              : 'Twoja prośba została odrzucona';
              
            await supabase.from('notifications').insert({
              type: responseType,
              title: responseTitle,
              message: responseMessage,
              user_id: notificationData.user_id,
              target_id: notificationData.target_id,
              target_type: notificationData.target_type,
            });
          }

          await get().fetchNotifications();
        } catch (error) {
          console.error('Error in updateNotificationStatus:', error);
        }
      },

      getNotificationsForUser: (userId) => {
        const { notifications } = get();
        return notifications.filter(n => 
          (n.fromUserId === userId) || 
          (!n.fromUserId && !n.fromUserName)
        );
      },
      
      deleteNotification: async (id) => {
        try {
          const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting notification:', error);
            return;
          }

          await get().fetchNotifications();
        } catch (error) {
          console.error('Error in deleteNotification:', error);
        }
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Initialize by fetching notifications
setTimeout(() => {
  useNotifications.getState().fetchNotifications().catch(err => {
    console.error("Initial notification fetch failed:", err);
  });
}, 1000);

// Helper functions for adding specific notification types
export const addCommentNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return useNotifications.getState().addNotification({
    type: 'comment_added',
    title: 'Nowy komentarz',
    message: `${userName} dodał komentarz do "${postTitle}"`,
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post',
  });
};

export const addLikeNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return useNotifications.getState().addNotification({
    type: 'like_added',
    title: 'Nowe polubienie',
    message: `${userName} polubił "${postTitle}"`,
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post',
  });
};
