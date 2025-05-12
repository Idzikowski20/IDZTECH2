
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

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

// Sample mock notifications for initial state
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'System info',
    message: 'Welcome to the notification system! This is a local storage based implementation.',
    createdAt: new Date().toISOString(),
    status: 'unread'
  },
  {
    id: '2',
    type: 'success',
    title: 'Setup complete',
    message: 'Notification system has been successfully initialized.',
    createdAt: new Date().toISOString(),
    status: 'unread'
  }
];

// Storage key for notifications
const STORAGE_KEY = 'app_notifications';

export const useNotificationService = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const { toast } = useToast();

  // Load notifications from localStorage
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching notifications from local storage...");
      
      // Check online status
      if (!navigator.onLine) {
        setIsOfflineMode(true);
        console.log("Device is offline");
      } else {
        setIsOfflineMode(false);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get notifications from localStorage
      const savedNotifications = localStorage.getItem(STORAGE_KEY);
      let notificationData: Notification[] = [];
      
      if (savedNotifications) {
        notificationData = JSON.parse(savedNotifications);
        console.log("Loaded notifications:", notificationData.length);
      } else {
        // If no notifications found, use initial data
        notificationData = INITIAL_NOTIFICATIONS;
        console.log("No saved notifications found, using initial data");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notificationData));
      }
      
      setNotifications(notificationData);
      const unread = notificationData.filter(n => n.status === 'unread').length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      setError('Failed to load notifications');
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Save notifications to localStorage
  const saveNotifications = useCallback((notifications: Notification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, []);
  
  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      saveNotifications(updated);
      return updated;
    });
    
    if (notification.status === 'unread') {
      setUnreadCount(prev => prev + 1);
    }
    
    return newNotification.id;
  }, [saveNotifications]);
  
  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' as NotificationStatus } 
          : notification
      );
      saveNotifications(updated);
      return updated;
    });
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [saveNotifications]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, status: 'read' as NotificationStatus }));
      saveNotifications(updated);
      return updated;
    });
    
    setUnreadCount(0);
    
    toast({
      title: "Sukces",
      description: "Wszystkie powiadomienia zostały oznaczone jako przeczytane",
    });
  }, [saveNotifications, toast]);
  
  // Delete a notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      
      if (notification && notification.status === 'unread') {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
    
    toast({
      title: "Sukces",
      description: "Powiadomienie zostało usunięte",
    });
  }, [saveNotifications, toast]);
  
  // Handle approval
  const handleApprove = useCallback((id: string) => {
    markAsRead(id);
    
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      
      if (notification && notification.fromUserId) {
        // Create a response notification
        const responseNotification: Omit<Notification, 'id' | 'createdAt'> = {
          type: 'approval_accepted',
          title: 'Prośba zaakceptowana',
          message: 'Twoja prośba została zaakceptowana',
          status: 'unread',
          fromUserId: notification.fromUserId,
          targetId: notification.targetId,
          targetType: notification.targetType
        };
        
        // Add the new notification
        const newId = uuidv4();
        const newNotification: Notification = {
          ...responseNotification,
          id: newId,
          createdAt: new Date().toISOString()
        };
        
        const updated = [newNotification, ...prev];
        saveNotifications(updated);
        return updated;
      }
      
      return prev;
    });
    
    toast({
      title: "Sukces",
      description: "Powiadomienie zostało zatwierdzone",
    });
  }, [markAsRead, saveNotifications, toast]);
  
  // Handle rejection
  const handleReject = useCallback((id: string, comment?: string) => {
    markAsRead(id);
    
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      
      if (notification && notification.fromUserId) {
        // Create a response notification
        const responseNotification: Omit<Notification, 'id' | 'createdAt'> = {
          type: 'approval_rejected',
          title: 'Prośba odrzucona',
          message: comment || 'Twoja prośba została odrzucona',
          status: 'unread',
          fromUserId: notification.fromUserId,
          targetId: notification.targetId,
          targetType: notification.targetType,
          comment
        };
        
        // Add the new notification
        const newId = uuidv4();
        const newNotification: Notification = {
          ...responseNotification,
          id: newId,
          createdAt: new Date().toISOString()
        };
        
        const updated = [newNotification, ...prev];
        saveNotifications(updated);
        return updated;
      }
      
      return prev;
    });
    
    toast({
      title: "Sukces",
      description: "Powiadomienie zostało odrzucone",
    });
  }, [markAsRead, saveNotifications, toast]);
  
  // Load notifications on init and when online status changes
  useEffect(() => {
    fetchNotifications();
    
    const handleOnline = () => {
      console.log("Device is now online");
      setIsOfflineMode(false);
      fetchNotifications();
    };
    
    const handleOffline = () => {
      console.log("Device is now offline");
      setIsOfflineMode(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchNotifications]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    isOfflineMode,
    retrying,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    handleApprove,
    handleReject,
    fetchNotifications,
  };
};
