
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 
  | 'post_created' 
  | 'post_edited' 
  | 'post_deleted' 
  | 'user_edited'
  | 'comment_added'
  | 'comment_pending'
  | 'comment_approved'
  | 'comment_rejected'
  | 'like_added'
  | 'info'
  | 'error'
  | 'success'
  | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user_id?: string;
  target_id?: string;
  target_type?: string;
}

// Funkcja do dodawania powiadomień
export const addNotification = async (notification: {
  type: NotificationType;
  title: string;
  message: string;
  user_id?: string;
  target_id?: string;
  target_type?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        user_id: notification.user_id,
        target_id: notification.target_id,
        target_type: notification.target_type,
        is_read: false
      })
      .select();

    if (error) {
      console.error('Error adding notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error in addNotification:', err);
    return { success: false, error: err };
  }
};

// Funkcja do oznaczania powiadomień jako przeczytane
export const markNotificationAsRead = async (id: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in markNotificationAsRead:', err);
    return { success: false, error: err };
  }
};

// Funkcja do oznaczania wszystkich powiadomień jako przeczytane
export const markAllNotificationsAsRead = async () => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in markAllNotificationsAsRead:', err);
    return { success: false, error: err };
  }
};

// Funkcja do usuwania powiadomienia
export const deleteNotification = async (id: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in deleteNotification:', err);
    return { success: false, error: err };
  }
};

// Funkcja do obsługi komentarza oczekującego
export const handlePendingComment = async (
  notificationId: string, 
  commentId: string, 
  approved: boolean
) => {
  try {
    if (approved) {
      // Zatwierdzenie komentarza
      const { error: commentError } = await supabase
        .from('blog_comments')
        .update({ status: 'approved' })
        .eq('id', commentId);

      if (commentError) {
        console.error('Error approving comment:', commentError);
        return { success: false, error: commentError };
      }
      
      // Aktualizacja powiadomienia
      const { error: notificationError } = await supabase
        .from('notifications')
        .update({ 
          type: 'comment_approved',
          title: 'Komentarz zatwierdzony',
          is_read: true 
        })
        .eq('id', notificationId);
        
      if (notificationError) {
        console.error('Error updating notification:', notificationError);
      }
    } else {
      // Odrzucenie komentarza
      const { error: commentError } = await supabase
        .from('blog_comments')
        .update({ status: 'rejected' })
        .eq('id', commentId);

      if (commentError) {
        console.error('Error rejecting comment:', commentError);
        return { success: false, error: commentError };
      }
      
      // Aktualizacja powiadomienia
      const { error: notificationError } = await supabase
        .from('notifications')
        .update({ 
          type: 'comment_rejected',
          title: 'Komentarz odrzucony',
          is_read: true 
        })
        .eq('id', notificationId);
        
      if (notificationError) {
        console.error('Error updating notification:', notificationError);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error in handlePendingComment:', err);
    return { success: false, error: err };
  }
};

// Helper dla wysyłania powiadomienia o utworzeniu posta
export const notifyPostCreated = async (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return addNotification({
    type: 'post_created',
    title: 'Nowy post został utworzony',
    message: `Post "${postTitle}" został utworzony przez ${userName}`,
    user_id: userId,
    target_id: postId,
    target_type: 'post'
  });
};

// Helper dla wysyłania powiadomienia o usunięciu posta
export const notifyPostDeleted = async (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return addNotification({
    type: 'post_deleted',
    title: 'Post został usunięty',
    message: `Post "${postTitle}" został usunięty przez ${userName}`,
    user_id: userId,
    target_id: postId,
    target_type: 'post'
  });
};

// Helper dla wysyłania powiadomienia o edycji posta
export const notifyPostEdited = async (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return addNotification({
    type: 'post_edited',
    title: 'Post został zaktualizowany',
    message: `Post "${postTitle}" został zaktualizowany przez ${userName}`,
    user_id: userId,
    target_id: postId,
    target_type: 'post'
  });
};

// Helper dla wysyłania powiadomienia o komentarzu
export const notifyCommentAdded = async (
  postId: string, 
  postTitle: string, 
  userName: string, 
  commentContent: string,
  commentId: string,
  status: 'pending' | 'approved' = 'approved',
  userId: string = ""
) => {
  return addNotification({
    type: status === 'pending' ? 'comment_pending' : 'comment_added',
    title: status === 'pending' ? 'Komentarz oczekuje na zatwierdzenie' : 'Nowy komentarz',
    message: `${userName}: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}" na post "${postTitle}"`,
    user_id: userId,
    target_id: commentId,
    target_type: 'comment'
  });
};

// Helper dla wysyłania powiadomienia o polubieniu
export const notifyLikeAdded = async (postId: string, postTitle: string, userName: string, userId: string = "") => {
  return addNotification({
    type: 'like_added',
    title: 'Nowe polubienie',
    message: `${userName} polubił post "${postTitle}"`,
    user_id: userId,
    target_id: postId,
    target_type: 'post'
  });
};
