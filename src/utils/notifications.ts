
import { create } from 'zustand';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/utils/AuthProvider';
import { useToast } from '@/hooks/use-toast';

// Define notification types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user_id?: string;
  target_id?: string;
  target_type?: string;
}

// Create notification store
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
  fetchNotifications: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(note => !note.is_read).length;
    set({ notifications, unreadCount });
  },
  markAsRead: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }
      
      const notifications = get().notifications.map(note => 
        note.id === id ? { ...note, is_read: true } : note
      );
      
      const unreadCount = notifications.filter(note => !note.is_read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error("Error in markAsRead:", error);
    }
  },
  markAllAsRead: async () => {
    const { user_id } = get().notifications[0] || {};
    
    if (!user_id) {
      console.error("No user_id found in notifications");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user_id)
        .is('is_read', false);
      
      if (error) {
        console.error("Error marking all notifications as read:", error);
        return;
      }
      
      const notifications = get().notifications.map(note => ({ ...note, is_read: true }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error("Error in markAllAsRead:", error);
    }
  },
  addNotification: (notification) => {
    const notifications = [notification, ...get().notifications];
    const unreadCount = notifications.filter(note => !note.is_read).length;
    set({ notifications, unreadCount });
  },
  deleteNotification: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting notification:", error);
        return;
      }
      
      const notifications = get().notifications.filter(note => note.id !== id);
      const unreadCount = notifications.filter(note => !note.is_read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error("Error in deleteNotification:", error);
    }
  },
  fetchNotifications: async (userId) => {
    if (!userId) {
      console.error("No user ID provided to fetch notifications");
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      // Add a timeout to simulate network delay
      // This helps with debugging race conditions
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching notifications:", error);
        set({ error: `Błąd pobierania powiadomień: ${error.message}`, loading: false });
        return;
      }
      
      if (!data) {
        set({ notifications: [], unreadCount: 0, loading: false });
        return;
      }
      
      const unreadCount = data.filter(note => !note.is_read).length;
      set({ notifications: data, unreadCount, loading: false });
    } catch (error: any) {
      console.error("Unexpected error in fetchNotifications:", error);
      set({ error: `Nieoczekiwany błąd: ${error.message || JSON.stringify(error)}`, loading: false });
    }
  }
}));

// Hook for using notifications in components
export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationStore();

  // Fetch notifications when user changes
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        await fetchNotifications(user.id);
        setInitialized(true);
      } catch (error) {
        console.error("Error in notification hook:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać powiadomień",
          variant: "destructive"
        });
      }
    };

    if (user?.id && !initialized) {
      fetchData();
    }
    
    if (!user) {
      setInitialized(false);
    }

    // Set up real-time listener for new notifications
    const setupSubscription = async () => {
      if (!user?.id) return;
      
      const channel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            // Refresh notifications when changes occur
            fetchNotifications(user.id);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    const unsubscribe = setupSubscription();
    
    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub && unsub());
      }
    };
  }, [user, initialized, fetchNotifications, toast]);
  
  const refetchNotifications = async () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    
    try {
      await fetchNotifications(user.id);
    } catch (err) {
      console.error("Error refetching notifications:", err);
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetchNotifications
  };
};

export default useNotifications;
