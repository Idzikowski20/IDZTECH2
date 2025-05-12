
import { useState, useEffect, useCallback } from 'react';
import NotificationService, { Notification } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const service = NotificationService.getInstance();
  
  // Pobranie powiadomień przy montowaniu komponentu
  useEffect(() => {
    setLoading(true);
    
    // Pobranie początkowego stanu
    const initialNotifications = service.getNotifications();
    setNotifications(initialNotifications);
    setUnreadCount(service.getUnreadCount());
    setLoading(false);
    
    // Subskrypcja zmian
    const unsubscribe = service.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(service.getUnreadCount());
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Funkcje pomocnicze - delegowanie do serwisu
  const markAsRead = useCallback((id: string) => {
    service.markAsRead(id);
  }, [service]);
  
  const markAllAsRead = useCallback(() => {
    service.markAllAsRead();
  }, [service]);
  
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    return service.addNotification(notification);
  }, [service]);
  
  const deleteNotification = useCallback((id: string) => {
    service.deleteNotification(id);
  }, [service]);
  
  const handleApprove = useCallback((id: string) => {
    service.handleApprove(id);
  }, [service]);
  
  const handleReject = useCallback((id: string, comment?: string) => {
    service.handleReject(id, comment);
  }, [service]);
  
  const fetchNotifications = useCallback(() => {
    const updatedNotifications = service.getNotifications();
    setNotifications(updatedNotifications);
    setUnreadCount(service.getUnreadCount());
  }, [service]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error: null,
    isOfflineMode: false,
    retrying: false,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    handleApprove,
    handleReject,
    fetchNotifications
  };
};
