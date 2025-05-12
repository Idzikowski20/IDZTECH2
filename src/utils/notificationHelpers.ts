
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
    
    if (error && error.code !== 'PGRST116') { // Not found is not a real error
      console.error('Error finding user by email:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in findUserByEmail:', error);
    return { success: false, error };
  }
};

// Update roles for specific users
export const updateUserRoles = async () => {
  try {
    // Find Aleksandra by email and update to blogger role
    const { data: aleksandraData } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'ola.gor109@gmail.com');
    
    if (aleksandraData && aleksandraData.length > 0) {
      if (!aleksandraData[0].role || aleksandraData[0].role !== 'blogger') {
        await supabase
          .from('profiles')
          .update({ role: 'blogger' })
          .eq('id', aleksandraData[0].id);
        console.log('Updated Aleksandra to blogger role');
      }
    } else {
      console.log('Aleksandra not found, will try to find by similar email');
      // Try to find by partial email match if exact match fails
      const { data: similarEmailsData } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', '%ola%gor%');
        
      if (similarEmailsData && similarEmailsData.length > 0) {
        await supabase
          .from('profiles')
          .update({ role: 'blogger' })
          .eq('id', similarEmailsData[0].id);
        console.log('Updated user with similar email to blogger role:', similarEmailsData[0].email);
      }
    }
    
    // Find Patryk by email and update to administrator role
    const { data: patrykData } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'patryk.idzikowski@interia.pl');
    
    if (patrykData && patrykData.length > 0) {
      if (!patrykData[0].role || patrykData[0].role !== 'administrator') {
        await supabase
          .from('profiles')
          .update({ role: 'administrator' })
          .eq('id', patrykData[0].id);
        console.log('Updated Patryk to administrator role');
      }
    } else {
      console.log('Patryk not found, will try to find by similar email');
      // Try to find by partial email match if exact match fails
      const { data: similarEmailsData } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', '%patryk%idzikowski%');
        
      if (similarEmailsData && similarEmailsData.length > 0) {
        await supabase
          .from('profiles')
          .update({ role: 'administrator' })
          .eq('id', similarEmailsData[0].id);
        console.log('Updated user with similar email to administrator role:', similarEmailsData[0].email);
      }
    }

    // Delete user with email 'admin@example.com' if exists
    const { data: adminData } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@example.com');

    if (adminData && adminData.length > 0) {
      await supabase
        .from('profiles')
        .delete()
        .eq('id', adminData[0].id);
      console.log('Deleted Admin user');
      
      // Also delete from auth.users if possible
      try {
        await supabase.auth.admin.deleteUser(adminData[0].id);
      } catch (e) {
        console.log('Could not delete from auth.users, may require admin rights');
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateUserRoles:', error);
    return { success: false, error };
  }
};

// Call the function to ensure roles are updated
updateUserRoles();
