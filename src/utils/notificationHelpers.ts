
import { useNotifications } from '@/hooks/useNotifications';
import NotificationService from '@/services/notificationService';

// Helper dla wysyłania powiadomień bez bezpośredniego importu hooka
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
    const service = NotificationService.getInstance();
    
    service.addNotification({
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

// Helper dla wysyłania powiadomienia o prośbie o zatwierdzenie
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

// Helper dla wysyłania powiadomienia o utworzeniu posta
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

// Helper dla wysyłania powiadomienia o komentarzu
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

// Helper dla wysyłania powiadomienia o polubieniu
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
