import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/utils/auth';
import { useNotifications, Notification, NotificationStatus } from '@/utils/notifications';
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
  MessageSquare
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

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'post_created':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'post_edited':
      return <FileText className="h-5 w-5 text-amber-500" />;
    case 'post_deleted':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'comment_added':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'like_added':
      return <ThumbsUp className="h-5 w-5 text-blue-500" />;
    case 'approval_request':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case 'approval_accepted':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'approval_rejected':
      return <X className="h-5 w-5 text-red-500" />;
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
  const { user, isAuthenticated } = useAuth();
  const { notifications, markAsRead, updateNotificationStatus, deleteNotification } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  const handleApprove = (notification: Notification) => {
    updateNotificationStatus(notification.id, 'approved');
    toast({
      title: 'Zatwierdzono',
      description: 'Prośba została zatwierdzona',
    });
  };

  const openRejectDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setRejectionComment('');
    setOpenDialog(true);
  };

  const handleReject = () => {
    if (selectedNotification) {
      updateNotificationStatus(
        selectedNotification.id,
        'rejected',
        rejectionComment || 'Brak komentarza'
      );
      setOpenDialog(false);
      toast({
        title: 'Odrzucono',
        description: 'Prośba została odrzucona',
      });
    }
  };

  const handleDelete = (notification: Notification) => {
    deleteNotification(notification.id);
    toast({
      title: 'Usunięto',
      description: 'Powiadomienie zostało usunięte',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Powiadomienia</h1>
            <p className="text-muted-foreground">Zarządzaj powiadomieniami systemu</p>
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
                    {notification.status === 'pending' && (
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
                    >
                      Usuń
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {notifications.filter(n => n.status === 'pending').length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Brak oczekujących powiadomień
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter(n => n.status === 'pending')
                .map(notification => (
                  // Same card component as above, but filtered for pending
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
                  // Similar card component, but for unread notifications
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
                      >
                        Usuń
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            {notifications.filter(n => n.status === 'approved' || n.status === 'rejected').length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Brak przetworzonych powiadomień
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter(n => n.status === 'approved' || n.status === 'rejected')
                .map(notification => (
                  // Similar card component, but for processed notifications
                  <Card 
                    key={notification.id}
                    className={notification.status === 'approved' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}
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
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
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
