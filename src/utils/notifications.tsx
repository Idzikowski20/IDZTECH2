
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning' | 'comment' | 'like';
  timestamp: Date;
  read: boolean;
  data?: {
    postId?: string;
    postTitle?: string;
    commentId?: string;
    userId?: string;
    userName?: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  getNotifications: (limit?: number) => Notification[];
}

// Initialize notification store
export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        // Create a new notification with ID and timestamp
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
        };

        // Add notification and update unread count
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        return newNotification.id;
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) {
            return state; // No changes needed
          }

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      deleteAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      getNotifications: (limit) => {
        const notifications = get().notifications;
        if (!limit) return notifications;
        return notifications.slice(0, limit);
      },
    }),
    {
      name: 'notifications-storage',
    }
  )
);

// Helper for adding a comment notification
export const addCommentNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return useNotifications.getState().addNotification({
    title: 'Nowy komentarz',
    message: `${userName} dodał komentarz do "${postTitle}"`,
    type: 'comment',
    read: false,
    data: {
      postId,
      postTitle,
      userId,
      userName
    }
  });
};

// Helper for adding a like notification
export const addLikeNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return useNotifications.getState().addNotification({
    title: 'Nowe polubienie',
    message: `${userName} polubił "${postTitle}"`,
    type: 'like',
    read: false,
    data: {
      postId,
      postTitle,
      userId,
      userName
    }
  });
};
