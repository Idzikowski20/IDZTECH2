
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/utils/AuthProvider';
import { useToast } from '@/hooks/use-toast';

// Define types
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
  targetId?: string;
  targetType?: string;
  comment?: string;
}

// Maximum retry attempts for failed API calls
const MAX_RETRY_ATTEMPTS = 3;

export const useNotificationService = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch notifications from Supabase with retry logic
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

      // Create a fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);
          
        clearTimeout(timeoutId);
        
        if (fetchError) {
          throw fetchError;
        }

        // If we have no data, set an empty array and return
        if (!data || data.length === 0) {
          console.log("No notifications found");
          setNotifications([]);
          setUnreadCount(0);
          setLoading(false);
          setRetryCount(0); // Reset retry count on success
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
                .maybeSingle();
              
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
        setRetryCount(0); // Reset retry count on success
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (error: any) {
      console.error('Error in fetchNotifications:', error);
      
      // Implement exponential backoff retry
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        const delayMs = Math.min(1000 * Math.pow(2, nextRetryCount), 10000); // Max 10 seconds
        console.log(`Retrying in ${delayMs}ms (attempt ${nextRetryCount}/${MAX_RETRY_ATTEMPTS})`);
        
        setTimeout(() => {
          fetchNotifications();
        }, delayMs);
      } else {
        // Max retries reached, show error
        setError('Wystąpił błąd podczas pobierania powiadomień. Spróbuj ponownie później.');
        setLoading(false);
      }
    } finally {
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        setLoading(false);
      }
    }
  }, [user, retryCount]);

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

      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  }, [toast]);

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

      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          ({ ...notification, status: 'read' })
        )
      );
      setUnreadCount(0);
      
      toast({
        title: "Sukces",
        description: "Wszystkie powiadomienia zostały oznaczone jako przeczytane",
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  }, [toast]);

  // Approve notification
  const handleApprove = useCallback(async (id: string) => {
    try {
      // First update the notification to mark as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error approving notification:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się zatwierdzić powiadomienia",
          variant: "destructive"
        });
        return;
      }

      // Find the notification in our local state
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // Create response notification for user
      if (notification.fromUserId) {
        await supabase.from('notifications').insert({
          type: 'approval_accepted',
          title: 'Prośba zaakceptowana',
          message: 'Twoja prośba została zaakceptowana',
          user_id: notification.fromUserId,
          target_id: notification.targetId,
          target_type: notification.targetType,
        });
      }
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === id 
            ? { ...n, status: 'read' } 
            : n
        )
      );
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało zatwierdzone",
      });
    } catch (error) {
      console.error('Error in handleApprove:', error);
    }
  }, [notifications, toast]);

  // Reject notification
  const handleReject = useCallback(async (id: string, comment?: string) => {
    try {
      // First update the notification to mark as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting notification:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się odrzucić powiadomienia",
          variant: "destructive"
        });
        return;
      }

      // Find the notification in our local state
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // Create response notification for user
      if (notification.fromUserId) {
        await supabase.from('notifications').insert({
          type: 'approval_rejected',
          title: 'Prośba odrzucona',
          message: comment || 'Twoja prośba została odrzucona',
          user_id: notification.fromUserId,
          target_id: notification.targetId,
          target_type: notification.targetType,
        });
      }
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === id 
            ? { ...n, status: 'read', comment } 
            : n
        )
      );
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało odrzucone",
      });
    } catch (error) {
      console.error('Error in handleReject:', error);
    }
  }, [notifications, toast]);

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

      // Update local state
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== id)
      );
      
      // Update unread count if needed
      if (deletedNotification && deletedNotification.status === 'unread') {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało usunięte",
      });
    } catch (error) {
      console.error('Error in deleteNotification:', error);
    }
  }, [notifications, toast]);

  // Add a new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          user_id: notification.fromUserId,
          target_id: notification.targetId,
          target_type: notification.targetType,
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

  // Listen for real-time updates
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up notifications listener for user:", user);
    fetchNotifications();
    
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
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

  // Setup retry on connection error
  useEffect(() => {
    if (error && navigator.onLine) {
      // If there's an error but we're online, try again after a delay
      const timer = setTimeout(() => {
        console.log("Retrying fetch after error...");
        setRetryCount(0); // Reset retry count
        fetchNotifications();
      }, 30000); // Retry after 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [error, fetchNotifications]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log("Browser went online, refreshing notifications...");
      setRetryCount(0);
      fetchNotifications();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    addNotification,
    handleApprove,
    handleReject,
    deleteNotification,
    fetchNotifications,
  };
};
