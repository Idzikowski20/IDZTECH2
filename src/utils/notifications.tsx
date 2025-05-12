
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'comment' | 'like' | 'info' | 'error' | 'success' | 'warning' | 
  'approval_request' | 'approval_accepted' | 'approval_rejected' | 'post_created' | 
  'post_edited' | 'post_deleted' | 'comment_added' | 'like_added' | 'user_edited';

export type NotificationStatus = 'read' | 'unread' | 'pending' | 'approved' | 'rejected';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  fromUserId?: string;
  fromUserName?: string;
  targetId?: string;
  targetType?: string;
  comment?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateNotificationStatus: (id: string, status: NotificationStatus, comment?: string) => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  getNotifications: () => Notification[];
  getUnreadCount: () => number;
}

// Initialize notification store
export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        // Create a new notification with ID and timestamp
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'unread',
        };

        // Add notification
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));

        return newNotification.id;
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id && n.status === 'unread' ? { ...n, status: 'read' } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.status === 'unread' ? { ...n, status: 'read' } : n
          ),
        }));
      },

      updateNotificationStatus: (id, status, comment) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status, ...(comment ? { comment } : {}) } : n
          ),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      deleteAllNotifications: () => {
        set({ notifications: [] });
      },

      getNotifications: () => {
        return get().notifications;
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => n.status === 'unread').length;
      },
    }),
    {
      name: 'notifications-storage',
    }
  )
);

// Helper for adding a notification
export const addSystemNotification = (
  title: string,
  message: string,
  type: NotificationType,
  fromUserName?: string,
  fromUserId?: string,
  targetId?: string,
  targetType?: string
) => {
  return useNotifications.getState().addNotification({
    title,
    message,
    type,
    fromUserName,
    fromUserId,
    targetId,
    targetType
  });
};

// Helper for adding a comment notification
export const addCommentNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return useNotifications.getState().addNotification({
    title: 'Nowy komentarz',
    message: `${userName} dodał komentarz do "${postTitle}"`,
    type: 'comment_added',
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post'
  });
};

// Helper for adding a like notification
export const addLikeNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return useNotifications.getState().addNotification({
    title: 'Nowe polubienie',
    message: `${userName} polubił "${postTitle}"`,
    type: 'like_added',
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post'
  });
};
