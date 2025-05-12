
import React from 'react';
import { Bell, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useSupabaseNotifications, NotificationType } from '@/hooks/useSupabaseNotifications';
import { format, formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NotificationBell: React.FC = () => {
  const { notifications, markAsRead, unreadCount, error, fetchNotifications } = useSupabaseNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (id: string, targetId?: string, targetType?: string) => {
    markAsRead(id);
    
    // Navigate to specific content if we have a target
    if (targetType === 'post' && targetId) {
      navigate(`/blog/${targetId}`);
    }
  };
  
  // Handle separate click on "Zobacz wszystkie" button
  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/admin/notifications');
  };
  
  const handleRetryFetch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fetchNotifications();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
      case 'approval_accepted':
        return <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1"></div>;
      case 'error':
      case 'approval_rejected':
        return <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1"></div>;
      case 'warning':
      case 'approval_request':
        return <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-1"></div>;
      case 'comment_added':
        return <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>;
      case 'like_added':
        return <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-1"></div>;
      case 'post_created':
      case 'post_edited':
      case 'post_deleted':
        return <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-1"></div>;
      case 'info':
      case 'user_edited':
      default:
        return <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>;
    }
  };

  const formatNotificationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true, locale: pl });
      }
      
      return format(date, 'dd.MM.yyyy, HH:mm', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data nieznana";
    }
  };

  console.log("Notifications in bell component:", notifications);
  console.log("Unread count:", unreadCount);
  console.log("Notification error:", error);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white hover:text-black">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="font-medium py-2 border-b border-gray-200 dark:border-gray-700">
          <h4>Powiadomienia</h4>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Masz {unreadCount} nieprzeczytanych powiadomień
            </p>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {error ? (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-2">
                Nie udało się pobrać powiadomień
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 mt-1"
                  onClick={handleRetryFetch}
                >
                  <RefreshCw className="h-3 w-3" />
                  Spróbuj ponownie
                </Button>
              </AlertDescription>
            </Alert>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Brak powiadomień
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id, notification.targetId, notification.targetType)}
                  className={`
                    p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white
                    ${notification.status === 'unread' ? 'bg-slate-50 dark:bg-slate-900' : ''}
                  `}
                >
                  <div className="flex gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{notification.title}</h5>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full hover:bg-white hover:text-black"
            onClick={handleViewAllClick}
          >
            Zobacz wszystkie
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
