
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

// Sample mock data for use when Supabase connection fails
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Tryb offline',
    message: 'System działa w trybie offline. Niektóre funkcje mogą być niedostępne.',
    createdAt: new Date().toISOString(),
    status: 'unread'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Problem z połączeniem',
    message: 'Wystąpiły problemy z połączeniem do serwera. Spróbuj ponownie za chwilę.',
    createdAt: new Date().toISOString(),
    status: 'unread'
  }
];

export const useNotificationService = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch notifications from Supabase with retry logic and fallback
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

      // Check online status first
      if (!navigator.onLine) {
        console.log("Browser is offline, using mock data");
        setIsOfflineMode(true);
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length);
        setLoading(false);
        return;
      }

      // Create a fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        // First test the connection with a simple query
        const { error: testError } = await supabase
          .from('notifications')
          .select('count', { count: 'exact', head: true })
          .abortSignal(controller.signal);
          
        if (testError) {
          console.error("Connection test failed:", testError);
          throw new Error("Nie można połączyć z serwerem powiadomień");
        }
        
        // If connection test passed, proceed with the actual query
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
          setIsOfflineMode(false);
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
        setIsOfflineMode(false);
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
        // Max retries reached, switch to offline mode
        console.log("Max retries reached, switching to offline mode");
        setIsOfflineMode(true);
        setError('Wystąpił błąd podczas pobierania powiadomień. Przełączono na tryb offline.');
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length);
        setLoading(false);
      }
    } finally {
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        setLoading(false);
      }
    }
  }, [user, retryCount]);

  // Create a local notification in offline mode
  const createLocalNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    if (notification.status === 'unread') {
      setUnreadCount(prev => prev + 1);
    }
    
    return true;
  };

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    // In offline mode, update local state only
    if (isOfflineMode) {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      return;
    }
    
    // Online mode - update database
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
  }, [isOfflineMode, toast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    // In offline mode, update local state only
    if (isOfflineMode) {
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
      return;
    }
    
    // Online mode - update database
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
  }, [isOfflineMode, toast]);

  // Add a new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    // In offline mode, create a local notification
    if (isOfflineMode) {
      const success = createLocalNotification(notification);
      return success;
    }
    
    // Online mode - add to database
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
          is_read: notification.status === 'read',
        });

      if (error) {
        console.error('Error adding notification:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się dodać powiadomienia",
          variant: "destructive"
        });
        return false;
      }

      fetchNotifications(); // Refresh notifications
      return true;
    } catch (error) {
      console.error('Error in addNotification:', error);
      
      // Fallback to local notification if database insert fails
      const success = createLocalNotification(notification);
      return success;
    }
  }, [fetchNotifications, isOfflineMode, toast]);

  // Delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    // In offline mode, update local state only
    if (isOfflineMode) {
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
      return;
    }
    
    // Online mode - delete from database
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
  }, [notifications, isOfflineMode, toast]);

  // Handle approval action
  const handleApprove = useCallback(async (id: string) => {
    // In offline mode, update local state only
    if (isOfflineMode) {
      markAsRead(id);
      toast({
        title: "Tryb offline",
        description: "Działanie zostanie zsynchronizowane po połączeniu z serwerem",
      });
      return;
    }
    
    try {
      // Mark notification as read
      await markAsRead(id);
      
      // Find the notification in our local state
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // Create response notification for user
      if (notification.fromUserId) {
        addNotification({
          type: 'approval_accepted',
          title: 'Prośba zaakceptowana',
          message: 'Twoja prośba została zaakceptowana',
          status: 'unread',
          fromUserId: notification.fromUserId,
          targetId: notification.targetId,
          targetType: notification.targetType
        });
      }
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało zatwierdzone",
      });
    } catch (error) {
      console.error('Error in handleApprove:', error);
    }
  }, [notifications, isOfflineMode, markAsRead, addNotification, toast]);

  // Handle reject action
  const handleReject = useCallback(async (id: string, comment?: string) => {
    // In offline mode, update local state only
    if (isOfflineMode) {
      markAsRead(id);
      toast({
        title: "Tryb offline",
        description: "Działanie zostanie zsynchronizowane po połączeniu z serwerem",
      });
      return;
    }
    
    try {
      // Mark notification as read
      await markAsRead(id);
      
      // Find the notification in our local state
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // Create response notification for user
      if (notification.fromUserId) {
        addNotification({
          type: 'approval_rejected',
          title: 'Prośba odrzucona',
          message: comment || 'Twoja prośba została odrzucona',
          status: 'unread',
          fromUserId: notification.fromUserId,
          targetId: notification.targetId,
          targetType: notification.targetType,
          comment
        });
      }
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało odrzucone",
      });
    } catch (error) {
      console.error('Error in handleReject:', error);
    }
  }, [notifications, isOfflineMode, markAsRead, addNotification, toast]);

  // Listen for real-time updates
  useEffect(() => {
    if (!user || isOfflineMode) return;
    
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
  }, [user, isOfflineMode, fetchNotifications]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log("Browser went online, refreshing notifications...");
      setRetryCount(0);
      setIsOfflineMode(false);
      fetchNotifications();
    };
    
    const handleOffline = () => {
      console.log("Browser went offline, switching to offline mode");
      setIsOfflineMode(true);
      
      if (notifications.length === 0) {
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length);
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchNotifications, notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isOfflineMode,
    markAsRead,
    markAllAsRead,
    addNotification,
    handleApprove,
    handleReject,
    deleteNotification,
    fetchNotifications,
  };
};
