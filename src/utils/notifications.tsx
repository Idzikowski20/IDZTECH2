
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean | null;
  created_at: string | null;
  user_id: string | null;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error: any) {
      console.error('Błąd podczas pobierania powiadomień:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się oznaczyć powiadomienia jako przeczytane',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      
      toast({
        title: 'Wszystkie powiadomienia oznaczone jako przeczytane',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się oznaczyć wszystkich powiadomień jako przeczytane',
        variant: 'destructive',
      });
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: 'Powiadomienie usunięte',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć powiadomienia',
        variant: 'destructive',
      });
    }
  };

  const createNotification = async (title: string, message: string, type = 'info') => {
    if (!user) return;
    
    try {
      // Wywołanie funkcji brzegowej do wysyłania powiadomień
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          userId: user.id,
          title,
          message,
          type
        }
      });
      
      if (error) throw error;
      
      // Odśwież listę powiadomień
      fetchNotifications();
    } catch (error: any) {
      console.error('Błąd podczas tworzenia powiadomienia:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się utworzyć powiadomienia',
        variant: 'destructive',
      });
    }
  };

  // Subskrybuj się na zmiany powiadomień w czasie rzeczywistym
  useEffect(() => {
    if (!user) return;
    
    fetchNotifications();
    
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        payload => {
          console.log('Zmiana w powiadomieniach:', payload);
          fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    fetchNotifications
  };
};
