
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
        .select('name, lastName, role')
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

// Helper function to update user role to add verification badge
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error updating user role:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return { success: false, error };
  }
};

// Helper function to check if a user exists by email
export const findUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error finding user by email:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in findUserByEmail:', error);
    return { success: false, error };
  }
};

// Let's make sure Aleksandra has the blogger role
export const ensureAleksandraHasBloggerRole = async () => {
  try {
    // Find Aleksandra by email
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'ola.gor109@gmail.com')
      .single();
    
    if (error) {
      console.error('Error finding Aleksandra:', error);
      return { success: false, error };
    }
    
    // If Aleksandra exists but doesn't have a role or has a different role than blogger
    if (data && (!data.role || data.role !== 'blogger')) {
      // Update her role to blogger
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'blogger' })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error updating Aleksandra role:', updateError);
        return { success: false, error: updateError };
      }
      
      console.log('Successfully updated Aleksandra to blogger role');
      return { success: true };
    } else if (data && data.role === 'blogger') {
      console.log('Aleksandra already has blogger role');
      return { success: true };
    } else {
      console.error('Aleksandra not found');
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error in ensureAleksandraHasBloggerRole:', error);
    return { success: false, error };
  }
};

// Call the function to ensure Aleksandra has the blogger role
ensureAleksandraHasBloggerRole();
