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
  RefreshCw,
  Loader2,
  WifiOff
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
import { useNotificationService } from '@/hooks/useNotificationService';

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    isOfflineMode,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    handleApprove,
    handleReject,
  } = useNotificationService();
  
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  // Open reject dialog
  const openRejectDialog = (notification: any) => {
    setSelectedNotification(notification);
    setRejectionComment('');
    setOpenDialog(true);
  };

  // Submit rejection with comment
  const submitRejection = async () => {
    if (!selectedNotification) return;
    
    await handleReject(selectedNotification.id, rejectionComment);
    setOpenDialog(false);
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
          <div className="mt-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-premium-purple mr-2" />
            <span>Ładowanie powiadomień...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // If there's an error loading notifications but we're not in offline mode
  if (error && !isOfflineMode) {
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

  // Show offline mode indicator if we're in offline mode
  const OfflineBanner = () => {
    if (!isOfflineMode) return null;
    
    return (
      <Alert className="mb-4 bg-amber-100 dark:bg-amber-900">
        <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle>Tryb offline</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          System działa w trybie offline. Niektóre funkcje mogą być niedostępne.
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetryFetch}
              className="flex items-center gap-2 text-amber-700 border-amber-700 hover:bg-amber-700 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Sprawdź połączenie
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

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

  const NotificationStatusBadge = ({ status }: { status: string }) => {
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Powiadomienia</h1>
            <p className="text-muted-foreground">
              {isOfflineMode ? 
                "Pracujesz w trybie offline. Niektóre funkcje mogą być ograniczone." : 
                "Zarządzaj powiadomieniami systemu"}
            </p>
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
              disabled={unreadCount === 0}
            >
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
        </div>

        <OfflineBanner />

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
                    {notification.type === 'approval_request' && notification.status === 'unread' && !isOfflineMode && (
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
                          onClick={() => handleApprove(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Zatwierdź
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
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
                      {!isOfflineMode && (
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
                            onClick={() => handleApprove(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Zatwierdź
                          </Button>
                        </>
                      )}
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
                        onClick={() => deleteNotification(notification.id)}
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
                        onClick={() => deleteNotification(notification.id)}
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
              onClick={submitRejection}
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
