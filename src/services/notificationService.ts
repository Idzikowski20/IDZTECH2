
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

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

// Storage key for notifications
const STORAGE_KEY = 'app_notifications';

// Class for managing notifications
class NotificationService {
  private static instance: NotificationService;
  private subscribers: Array<(notifications: Notification[]) => void> = [];

  private constructor() {
    // This is a singleton
    this.loadNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Get all notifications
  public getNotifications(): Notification[] {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return [];
    
    try {
      return JSON.parse(savedData) as Notification[];
    } catch (e) {
      console.error('Error parsing notifications:', e);
      return [];
    }
  }

  // Get unread count
  public getUnreadCount(): number {
    return this.getNotifications().filter(n => n.status === 'unread').length;
  }

  // Add a new notification
  public addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): string {
    const notifications = this.getNotifications();
    const newId = uuidv4();
    
    const newNotification: Notification = {
      ...notification,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    this.saveNotifications(updatedNotifications);
    
    return newId;
  }

  // Mark a notification as read
  public markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, status: 'read' as NotificationStatus } : n
    );
    
    this.saveNotifications(updatedNotifications);
  }

  // Mark all notifications as read
  public markAllAsRead(): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(n => ({ ...n, status: 'read' as NotificationStatus }));
    
    this.saveNotifications(updatedNotifications);
    
    toast({
      title: "Sukces",
      description: "Wszystkie powiadomienia zostały oznaczone jako przeczytane"
    });
  }

  // Delete a notification
  public deleteNotification(id: string): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    
    this.saveNotifications(updatedNotifications);
    
    toast({
      title: "Sukces",
      description: "Powiadomienie zostało usunięte"
    });
  }

  // Handle approval
  public handleApprove(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    
    if (notification && notification.fromUserId) {
      this.markAsRead(id);
      
      // Create a response notification
      this.addNotification({
        type: 'approval_accepted',
        title: 'Prośba zaakceptowana',
        message: 'Twoja prośba została zaakceptowana',
        status: 'unread',
        fromUserId: notification.fromUserId,
        targetId: notification.targetId,
        targetType: notification.targetType
      });
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało zatwierdzone"
      });
    }
  }

  // Handle rejection
  public handleReject(id: string, comment?: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    
    if (notification && notification.fromUserId) {
      this.markAsRead(id);
      
      // Create a response notification
      this.addNotification({
        type: 'approval_rejected',
        title: 'Prośba odrzucona',
        message: comment || 'Twoja prośba została odrzucona',
        status: 'unread',
        fromUserId: notification.fromUserId,
        targetId: notification.targetId,
        targetType: notification.targetType,
        comment
      });
      
      toast({
        title: "Sukces",
        description: "Powiadomienie zostało odrzucone"
      });
    }
  }

  // Subscribe to notifications changes
  public subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      // Notify subscribers
      this.notifySubscribers(notifications);
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }

  private loadNotifications(): void {
    try {
      const notifications = this.getNotifications();
      if (notifications.length > 0) {
        // Notifications already exist, do nothing
        return;
      }
      
      // If no notifications found, init with default
      const defaultNotifications: Notification[] = [
        {
          id: uuidv4(),
          type: 'info',
          title: 'System info',
          message: 'Witaj w systemie powiadomień!',
          createdAt: new Date().toISOString(),
          status: 'unread'
        }
      ];
      
      this.saveNotifications(defaultNotifications);
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  }

  private notifySubscribers(notifications: Notification[]): void {
    this.subscribers.forEach(callback => {
      try {
        callback(notifications);
      } catch (e) {
        console.error('Error notifying subscriber:', e);
      }
    });
  }
}

export default NotificationService;
