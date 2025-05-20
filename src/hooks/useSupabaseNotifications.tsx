import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/utils/AuthProvider';
import { useToast } from '@/hooks/use-toast';

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
  targetId?: string; // ID of post, user, etc. that the notification is about
  targetType?: string; // Type of target: "post", "user", etc.
  comment?: string; // Admin feedback in case of rejection
  // Required additions for UI display
  fromUserName?: string; // Added field for UI display
}

export const useSupabaseNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching notifications...");
      
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        setError(`Nie udało się pobrać powiadomień: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      // If we have no data, set an empty array and return
      if (!data || data.length === 0) {
        console.log("No notifications found");
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }
      
      console.log("Raw notifications data:", data);

      // Transform the Supabase data to match our Notification interface
      const transformedNotifications: Notification[] = await Promise.all(data.map(async notification => {
        // Try to get user name if we have user_id
        let fromUserName = '';
        if (notification.user_id) {
          try {
            const { data: userData } = await supabase
              .from('profiles')
              .select('name, lastName')
              .eq('id', notification.user_id)
              .single();
            
            if (userData) {
              fromUserName = userData.name || '';
              if (userData.lastName) {
                fromUserName += ` ${userData.lastName}`;
              }
            }
          } catch (e) {
            console.error('Error fetching user data:', e);
          }
        }

        return {
          id: notification.id,
          type: notification.type as NotificationType || 'info',
          title: notification.title,
          message: notification.message,
          createdAt: notification.created_at,
          status: notification.is_read ? 'read' as NotificationStatus : 'unread' as NotificationStatus,
          fromUserId: notification.user_id,
          targetId: notification.target_id || '',
          targetType: notification.target_type || '',
          fromUserName: fromUserName || 'Użytkownik', // Use fetched user name or default
        };
      }));
      
      console.log("Transformed notifications:", transformedNotifications);
      setNotifications(transformedNotifications);
      
      // Count unread notifications
      const unread = transformedNotifications.filter(n => n.status === 'unread').length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      setError('Wystąpił nieoczekiwany błąd podczas pobierania powiadomień');
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Add a new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'status'> & {status?: NotificationStatus}) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          is_read: notification.status === 'read',
          user_id: notification.fromUserId,
          target_id: notification.targetId ? notification.targetId : null,
          target_type: notification.targetType ? notification.targetType : null,
        });

      if (error) {
        console.error('Error adding notification:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się dodać powiadomienia",
          variant: "destructive"
        });
        return;
      }

      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error in addNotification:', error);
    }
  }, [fetchNotifications, toast]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się oznaczyć powiadomienia jako przeczytane",
          variant: "destructive"
        });
        return;
      }

      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  }, [fetchNotifications, toast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się oznaczyć wszystkich powiadomień jako przeczytane",
          variant: "destructive"
        });
        return;
      }

      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  }, [fetchNotifications, toast]);

  // Update notification status
  const updateNotificationStatus = useCallback(async (id: string, status: NotificationStatus, comment?: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: status === 'read'
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating notification status:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować statusu powiadomienia",
          variant: "destructive"
        });
        return;
      }

      // If we change a status to approved or rejected, create a new notification for the user
      const notificationToUpdate = notifications.find(n => n.id === id);
      if (notificationToUpdate && 
          (status === 'approved' || status === 'rejected') && 
          notificationToUpdate.fromUserId) {
          
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
          user_id: notificationToUpdate.fromUserId,
          target_id: notificationToUpdate.targetId,
          target_type: notificationToUpdate.targetType,
        });
      }

      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error in updateNotificationStatus:', error);
    }
  }, [fetchNotifications, notifications, toast]);

  // Delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notification:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć powiadomienia",
          variant: "destructive"
        });
        return;
      }

      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error in deleteNotification:', error);
    }
  }, [fetchNotifications, toast]);

  // Listen for real-time updates to notifications
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up notifications listener for user:", user);
    fetchNotifications();
    
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'notifications'
        },
        () => {
          console.log("Received notification change event");
          fetchNotifications();
        }
      )
      .subscribe();
    
    return () => {
      console.log("Cleaning up notifications listener");
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    addNotification: useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'status'> & {status?: NotificationStatus}) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .insert({
            type: notification.type,
            title: notification.title,
            message: notification.message,
            is_read: notification.status === 'read',
            user_id: notification.fromUserId,
            target_id: notification.targetId ? notification.targetId : null,
            target_type: notification.targetType ? notification.targetType : null,
          });
  
        if (error) {
          console.error('Error adding notification:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się dodać powiadomienia",
            variant: "destructive"
          });
          return;
        }
  
        fetchNotifications(); // Refresh notifications
      } catch (error) {
        console.error('Error in addNotification:', error);
      }
    }, [fetchNotifications, toast]),
    markAsRead: useCallback(async (id: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id);
  
        if (error) {
          console.error('Error marking notification as read:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się oznaczyć powiadomienia jako przeczytane",
            variant: "destructive"
          });
          return;
        }
  
        fetchNotifications(); // Refresh notifications
      } catch (error) {
        console.error('Error in markAsRead:', error);
      }
    }, [fetchNotifications, toast]),
    markAllAsRead: useCallback(async () => {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('is_read', false);
  
        if (error) {
          console.error('Error marking all notifications as read:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się oznaczyć wszystkich powiadomień jako przeczytane",
            variant: "destructive"
          });
          return;
        }
  
        fetchNotifications(); // Refresh notifications
      } catch (error) {
        console.error('Error in markAllAsRead:', error);
      }
    }, [fetchNotifications, toast]),
    updateNotificationStatus: useCallback(async (id: string, status: NotificationStatus, comment?: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ 
            is_read: status === 'read'
          })
          .eq('id', id);
  
        if (error) {
          console.error('Error updating notification status:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się zaktualizować statusu powiadomienia",
            variant: "destructive"
          });
          return;
        }
  
        // If we change a status to approved or rejected, create a new notification for the user
        const notificationToUpdate = notifications.find(n => n.id === id);
        if (notificationToUpdate && 
            (status === 'approved' || status === 'rejected') && 
            notificationToUpdate.fromUserId) {
            
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
            user_id: notificationToUpdate.fromUserId,
            target_id: notificationToUpdate.targetId,
            target_type: notificationToUpdate.targetType,
          });
        }
  
        fetchNotifications(); // Refresh notifications
      } catch (error) {
        console.error('Error in updateNotificationStatus:', error);
      }
    }, [fetchNotifications, notifications, toast]),
    deleteNotification: useCallback(async (id: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', id);
  
        if (error) {
          console.error('Error deleting notification:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się usunąć powiadomienia",
            variant: "destructive"
          });
          return;
        }
  
        fetchNotifications(); // Refresh notifications
      } catch (error) {
        console.error('Error in deleteNotification:', error);
      }
    }, [fetchNotifications, toast]),
    fetchNotifications
  };
};
