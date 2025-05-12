
import { supabase } from '@/utils/supabaseClient';

// Helper do wysyłania powiadomień bezpośrednio przez Supabase
export const sendNotification = async ({
  type,
  title,
  message,
  fromUserId,
  targetId,
  targetType,
  status = 'unread'
}: {
  type: string;
  title: string;
  message: string;
  fromUserId?: string;
  targetId?: string;
  targetType?: string;
  status?: 'unread' | 'read' | 'pending' | 'approved' | 'rejected';
}) => {
  try {
    const { error } = await supabase.from('notifications').insert({
      type,
      title,
      message,
      user_id: fromUserId,
      target_id: targetId,
      target_type: targetType,
      is_read: status !== 'unread'
    });

    if (error) {
      console.error('Error sending notification:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return false;
  }
};

// Helper dla wysyłania powiadomienia o prośbie o zatwierdzenie
export const sendApprovalRequest = async (
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
    targetId,
    targetType,
    status: 'pending'
  });
};

// Helper dla wysyłania powiadomienia o utworzeniu posta
export const notifyPostCreated = async (userId: string, userName: string, postId: string, postTitle: string) => {
  return sendNotification({
    type: 'post_created',
    title: 'Nowy post został utworzony',
    message: `Użytkownik ${userName} utworzył nowy post "${postTitle}"`,
    fromUserId: userId,
    targetId: postId,
    targetType: 'post'
  });
};

// Helper dla wysyłania powiadomienia o komentarzu
export const addCommentNotification = async (postId: string, postTitle: string, userName: string, userId: string = "") => {
  // Get user's full name from profile if available
  let fullName = userName;
  
  if (userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, lastName')
        .eq('id', userId)
        .single();
        
      if (data && data.name) {
        fullName = data.name;
        if (data.lastName) {
          fullName += ` ${data.lastName}`;
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  
  return sendNotification({
    type: 'comment_added',
    title: 'Nowy komentarz',
    message: `${fullName} dodał komentarz do "${postTitle}"`,
    fromUserId: userId,
    targetId: postId,
    targetType: 'post'
  });
};

// Helper dla wysyłania powiadomienia o polubieniu
export const addLikeNotification = async (postId: string, postTitle: string, userName: string, userId: string = "") => {
  // Get user's full name from profile if available
  let fullName = userName;
  
  if (userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, lastName')
        .eq('id', userId)
        .single();
        
      if (data && data.name) {
        fullName = data.name;
        if (data.lastName) {
          fullName += ` ${data.lastName}`;
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  
  return sendNotification({
    type: 'like_added',
    title: 'Nowe polubienie',
    message: `${fullName} polubił "${postTitle}"`,
    fromUserId: userId,
    targetId: postId,
    targetType: 'post'
  });
};
