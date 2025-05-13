
import { useNotificationService } from '@/hooks/useNotificationService';

// Helper for sending notifications without directly importing the hook
let notificationService: ReturnType<typeof useNotificationService> | null = null;

export const setNotificationService = (service: ReturnType<typeof useNotificationService>) => {
  notificationService = service;
};

// Helper to send a notification
export const sendNotification = ({
  type,
  title,
  message,
  fromUserId,
  targetId,
  targetType,
  status = 'unread',
  fromUserName = ''
}: {
  type: string;
  title: string;
  message: string;
  fromUserId?: string;
  targetId?: string;
  targetType?: string;
  status?: 'unread' | 'read' | 'pending' | 'approved' | 'rejected';
  fromUserName?: string;
}) => {
  try {
    if (!notificationService) {
      console.warn('Notification service not initialized, storing offline notification');
      
      // Store notification locally when service is not available
      const offlineNotifications = JSON.parse(localStorage.getItem('offlineNotifications') || '[]');
      
      const newNotification = {
        id: `offline-${Date.now()}`,
        type,
        title,
        message,
        fromUserId,
        targetId,
        targetType,
        status,
        createdAt: new Date().toISOString(),
        read: false,
        fromUserName
      };
      
      offlineNotifications.push(newNotification);
      localStorage.setItem('offlineNotifications', JSON.stringify(offlineNotifications));
      
      return true;
    }

    notificationService.addNotification({
      type: type as any,
      title,
      message,
      fromUserId,
      targetId,
      targetType,
      status: status as any,
      fromUserName
    });

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

// Helper for sending a notification about a prośba o zatwierdzenie
export const sendApprovalRequest = (
  fromUserId: string,
  fromUserName: string,
  targetId: string,
  targetType: string,
  title: string,
  message: string
) => {
  // Format message to include fromUserName for UI display
  const enhancedMessage = message.includes(fromUserName) ? message : `${fromUserName}: ${message}`;
  
  return sendNotification({
    type: 'approval_request',
    title,
    message: enhancedMessage,
    fromUserId,
    fromUserName,
    targetId,
    targetType,
    status: 'pending'
  });
};

// Helper for sending a notification about utworzenie posta
export const notifyPostCreated = (userId: string, userName: string, postId: string, postTitle: string) => {
  return sendNotification({
    type: 'post_created',
    title: 'Nowy post został utworzony',
    message: `Użytkownik ${userName} utworzył nowy post "${postTitle}"`,
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post'
  });
};

// Helper for sending a notification about a komentarz
export const addCommentNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return sendNotification({
    type: 'comment_added',
    title: 'Nowy komentarz',
    message: `${userName} dodał komentarz do "${postTitle}"`,
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post'
  });
};

// Helper for sending a notification about polubienie
export const addLikeNotification = (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return sendNotification({
    type: 'like_added',
    title: 'Nowe polubienie',
    message: `${userName} polubił "${postTitle}"`,
    fromUserId: userId,
    fromUserName: userName,
    targetId: postId,
    targetType: 'post'
  });
};
