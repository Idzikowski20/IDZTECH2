
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/utils/AuthProvider';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  FileText,
  ThumbsUp,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

// Notification types and interfaces
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

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'post_created':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'post_edited':
      return <FileText className="h-5 w-5 text-amber-500" />;
    case 'post_deleted':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'comment_added':
    case 'comment':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'like_added':
    case 'like':
      return <ThumbsUp className="h-5 w-5 text-blue-500" />;
    case 'approval_request':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case 'approval_accepted':
    case 'success':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'approval_rejected':
    case 'error':
      return <X className="h-5 w-5 text-red-500" />;
    case 'info':
    case 'warning':
      return <Info className="h-5 w-5 text-amber-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationStatusBadge = ({ status }: { status: NotificationStatus }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Oczekujące</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-500 text-white hover:bg-green-600 hover:text-white">Zaakceptowane</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Odrzucone</Badge>;
    case 'unread':
      return <Badge variant="outline">Nieprzeczytane</Badge>;
    case 'read':
      return <Badge variant="outline" className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-black">Przeczytane</Badge>;
    default:
      return null;
  }
};

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

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
          fromUserName: fromUserName || 'Użytkownik',
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
  }, [user]);

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
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
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się oznaczyć powiadomienia jako przeczytane",
        variant: "destructive"
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      
      fetchNotifications();
      toast({
        title: 'Oznaczono jako przeczytane',
        description: 'Wszystkie powiadomienia zostały oznaczone jako przeczytane',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się oznaczyć wszystkich powiadomień jako przeczytane",
        variant: "destructive"
      });
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  // Approve notification
  const handleApprove = async (notification: Notification) => {
    try {
      // Update notification status
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);
      
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
      
      fetchNotifications();
      toast({
        title: 'Zatwierdzono',
        description: 'Prośba została zatwierdzona',
      });
    } catch (error) {
      console.error('Error approving notification:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zatwierdzić prośby",
        variant: "destructive"
      });
    }
  };

  // Open reject dialog
  const openRejectDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setRejectionComment('');
    setOpenDialog(true);
  };

  // Reject notification
  const handleReject = async () => {
    if (selectedNotification) {
      try {
        // Update notification status
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', selectedNotification.id);
        
        // Create response notification for user
        if (selectedNotification.fromUserId) {
          await supabase.from('notifications').insert({
            type: 'approval_rejected',
            title: 'Prośba odrzucona',
            message: rejectionComment || 'Twoja prośba została odrzucona',
            user_id: selectedNotification.fromUserId,
            target_id: selectedNotification.targetId,
            target_type: selectedNotification.targetType,
          });
        }
        
        setOpenDialog(false);
        fetchNotifications();
        toast({
          title: 'Odrzucono',
          description: 'Prośba została odrzucona',
        });
      } catch (error) {
        console.error('Error rejecting notification:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się odrzucić prośby",
          variant: "destructive"
        });
      }
    }
  };

  // Delete notification
  const handleDelete = async (notification: Notification) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notification.id);
      
      fetchNotifications();
      toast({
        title: 'Usunięto',
        description: 'Powiadomienie zostało usunięte',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć powiadomienia",
        variant: "destructive"
      });
    }
  };

  // Retry fetching notifications
  const handleRetryFetch = () => {
    fetchNotifications();
    toast({
      title: 'Odświeżanie',
      description: 'Ponowne pobieranie powiadomień...',
    });
  };

  // If notifications are still loading, show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Powiadomienia</h1>
          <div className="mt-4">Ładowanie powiadomień...</div>
        </div>
      </AdminLayout>
    );
  }
  
  // If there's an error loading notifications
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Powiadomienia</h1>
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Błąd</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRetryFetch}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Spróbuj ponownie
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Powiadomienia</h1>
            <p className="text-muted-foreground">Zarządzaj powiadomieniami systemu</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRetryFetch}
              className="flex items-center gap-2 hover:bg-white hover:text-black"
            >
              <RefreshCw className="h-4 w-4" />
              Odśwież
            </Button>
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="hover:bg-white hover:text-black"
            >
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Wszystkie</TabsTrigger>
            <TabsTrigger value="pending">Oczekujące</TabsTrigger>
            <TabsTrigger value="unread">Nieprzeczytane</TabsTrigger>
            <TabsTrigger value="processed">Przetworzone</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Brak powiadomień
                </CardContent>
              </Card>
            ) : (
              notifications.map(notification => (
                <Card 
                  key={notification.id}
                  className={`${notification.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <NotificationIcon type={notification.type} />
                        <CardTitle>{notification.title}</CardTitle>
                      </div>
                      <NotificationStatusBadge status={notification.status} />
                    </div>
                    <CardDescription>
                      {new Date(notification.createdAt).toLocaleString('pl-PL')}
                      {notification.fromUserName && (
                        <span className="ml-2">• od {notification.fromUserName}</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent onClick={() => handleNotificationClick(notification)}>
                    <p>{notification.message}</p>
                    {notification.comment && (
                      <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                        <p className="text-sm font-medium">Komentarz:</p>
                        <p className="text-sm">{notification.comment}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {notification.type === 'approval_request' && notification.status === 'unread' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => openRejectDialog(notification)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Odrzuć
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                          onClick={() => handleApprove(notification)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Zatwierdź
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(notification)}
                      className="hover:bg-white hover:text-black"
                    >
                      Usuń
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {notifications.filter(n => n.type === 'approval_request' && n.status === 'unread').length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Brak oczekujących powiadomień
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter(n => n.type === 'approval_request' && n.status === 'unread')
                .map(notification => (
                  <Card 
                    key={notification.id}
                    className="border-l-4 border-l-amber-500"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <NotificationIcon type={notification.type} />
                          <CardTitle>{notification.title}</CardTitle>
                        </div>
                        <NotificationStatusBadge status={notification.status} />
                      </div>
                      <CardDescription>
                        {new Date(notification.createdAt).toLocaleString('pl-PL')}
                        {notification.fromUserName && (
                          <span className="ml-2">• od {notification.fromUserName}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent onClick={() => handleNotificationClick(notification)}>
                      <p>{notification.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => openRejectDialog(notification)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Odrzuć
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                        onClick={() => handleApprove(notification)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Zatwierdź
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => n.status === 'unread').length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Brak nieprzeczytanych powiadomień
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter(n => n.status === 'unread')
                .map(notification => (
                  <Card 
                    key={notification.id}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <NotificationIcon type={notification.type} />
                          <CardTitle>{notification.title}</CardTitle>
                        </div>
                        <NotificationStatusBadge status={notification.status} />
                      </div>
                      <CardDescription>
                        {new Date(notification.createdAt).toLocaleString('pl-PL')}
                        {notification.fromUserName && (
                          <span className="ml-2">• od {notification.fromUserName}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent onClick={() => handleNotificationClick(notification)}>
                      <p>{notification.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(notification)}
                        className="hover:bg-white hover:text-black"
                      >
                        Usuń
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            {notifications.filter(n => n.status === 'read').length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Brak przetworzonych powiadomień
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter(n => n.status === 'read')
                .map(notification => (
                  <Card 
                    key={notification.id}
                    className={notification.type === 'approval_accepted' ? 'border-l-4 border-l-green-500' : 
                              notification.type === 'approval_rejected' ? 'border-l-4 border-l-red-500' : ''}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <NotificationIcon type={notification.type} />
                          <CardTitle>{notification.title}</CardTitle>
                        </div>
                        <NotificationStatusBadge status={notification.status} />
                      </div>
                      <CardDescription>
                        {new Date(notification.createdAt).toLocaleString('pl-PL')}
                        {notification.fromUserName && (
                          <span className="ml-2">• od {notification.fromUserName}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{notification.message}</p>
                      {notification.comment && (
                        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <p className="text-sm font-medium">Komentarz:</p>
                          <p className="text-sm">{notification.comment}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(notification)}
                        className="hover:bg-white hover:text-black"
                      >
                        Usuń
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Odrzucenie prośby</DialogTitle>
            <DialogDescription>
              Dodaj informację dlaczego prośba została odrzucona. Ten komentarz będzie widoczny dla użytkownika.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Powód odrzucenia..."
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              className="hover:bg-white hover:text-black"
            >
              Anuluj
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
            >
              Odrzuć
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotifications;
