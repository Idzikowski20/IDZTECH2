
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Default notifications for testing
const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'post_created',
    title: 'Nowy wpis na blogu',
    message: 'Nowy artykuł został opublikowany na blogu',
    createdAt: new Date().toISOString(),
    status: 'unread',
    targetId: '1',
    targetType: 'post',
  },
  {
    id: '2',
    type: 'comment_added',
    title: 'Nowy komentarz',
    message: 'Jan Kowalski dodał komentarz do Twojego artykułu',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'unread',
    fromUserName: 'Jan Kowalski',
    targetId: '1',
    targetType: 'post',
  },
  {
    id: '3',
    type: 'approval_request',
    title: 'Prośba o zatwierdzenie',
    message: 'Nowa prośba o zatwierdzenie zawartości',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    fromUserName: 'Anna Nowak',
    targetId: '2',
    targetType: 'post',
  }
];

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
      notifications: defaultNotifications,
      unreadCount: defaultNotifications.filter(n => n.status === 'unread').length,
      
      fetchNotifications: async () => {
        // Local implementation - just return the stored notifications
        // This function exists for API compatibility with the previous implementation
        return Promise.resolve();
      },
      
      addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: notification.status || 'unread',
        };

        // Update unread count if the new notification is unread
        const newUnreadCount = newNotification.status === 'unread' ? 
          state.unreadCount + 1 : state.unreadCount;
        
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: newUnreadCount
        };
      }),
      
      markAsRead: (id) => set((state) => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.id === id && notification.status === 'unread'
            ? { ...notification, status: 'read' as NotificationStatus }
            : notification
        );
        
        // Count notifications with unread status
        const unreadCount = updatedNotifications.filter(n => n.status === 'unread').length;
        
        return { 
          notifications: updatedNotifications,
          unreadCount
        };
      }),

      markAllAsRead: () => set((state) => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.status === 'unread'
            ? { ...notification, status: 'read' as NotificationStatus }
            : notification
        );
        
        return { 
          notifications: updatedNotifications,
          unreadCount: 0
        };
      }),
      
      updateNotificationStatus: (id, status, comment) => set((state) => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.id === id
            ? { ...notification, status, ...(comment ? { comment } : {}) }
            : notification
        );
        
        // Update unread count
        const unreadCount = updatedNotifications.filter(n => n.status === 'unread').length;
        
        // If we change a status to approved or rejected, create a new notification for the user
        const targetNotification = state.notifications.find(n => n.id === id);
        if (targetNotification && 
            (status === 'approved' || status === 'rejected') && 
            targetNotification.fromUserId) {
            
          const responseType = status === 'approved' ? 'approval_accepted' as NotificationType : 'approval_rejected' as NotificationType;
          const responseTitle = status === 'approved' 
            ? 'Prośba zaakceptowana' 
            : 'Prośba odrzucona';
          
          const responseMessage = status === 'approved'
            ? 'Twoja prośba została zaakceptowana'
            : 'Twoja prośba została odrzucona';
            
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: responseType,
            title: responseTitle,
            message: responseMessage,
            createdAt: new Date().toISOString(),
            status: 'unread',
            targetId: targetNotification.targetId,
            targetType: targetNotification.targetType,
            comment: comment,
          };
          
          return {
            notifications: [newNotification, ...updatedNotifications],
            unreadCount: unreadCount + 1
          };
        }
        
        return { 
          notifications: updatedNotifications,
          unreadCount
        };
      }),

      getNotificationsForUser: (userId) => {
        const { notifications } = get();
        return notifications.filter(n => 
          (n.fromUserId === userId) || 
          (!n.fromUserId && !n.fromUserName) // Notifications without specific recipient (system notifications)
        );
      },
      
      deleteNotification: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification?.status === 'unread';
        
        const filteredNotifications = state.notifications.filter(n => n.id !== id);
        
        return { 
          notifications: filteredNotifications,
          unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
        };
      }),
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Helper functions for adding specific notification types
export const sendApprovalRequest = (fromUserId: string, fromUserName: string, targetId: string, targetType: string, title: string, message: string) => {
  useNotifications.getState().addNotification({
    type: 'approval_request',
    title,
    message,
    fromUserId,
    fromUserName,
    targetId,
    targetType,
    status: 'pending'
  });
};

export const notifyPostCreated = (userId: string, userName: string, postId: string, postTitle: string) => {
  useNotifications.getState().addNotification({
    type: 'post_created',
    title: 'Nowy post został utworzony',
    message: `Użytkownik ${userName} utworzył nowy post "${postTitle}"`,
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post',
  });
};

// Helper for adding a comment notification
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

// Helper for adding a like notification
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

// Helper for adding a guest comment request
export const addGuestCommentRequest = (postId: string, postTitle: string, guestName: string, commentContent: string) => {
  return useNotifications.getState().addNotification({
    type: 'approval_request',
    title: 'Prośba o zatwierdzenie komentarza gościa',
    message: `${guestName} chce dodać komentarz do "${postTitle}": "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
    fromUserName: guestName,
    targetId: postId,
    targetType: 'comment',
  });
};
