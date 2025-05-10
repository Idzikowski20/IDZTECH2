
import React from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/utils/notifications';
import { format, formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

// Definiowanie właściwego typu dla powiadomień
interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;  // zmienione z is_read na isRead
  createdAt: string; // zmienione z created_at na createdAt
}

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    navigate('/admin/notifications');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1"></div>;
      case 'error':
        return <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1"></div>;
      case 'warning':
        return <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-1"></div>;
      default:
        return <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>;
    }
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, locale: pl });
    }
    
    return format(date, 'dd.MM.yyyy, HH:mm', { locale: pl });
  };

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
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Brak powiadomień
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.slice(0, 5).map((notification: any) => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`
                    p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white
                    ${!notification.isRead ? 'bg-slate-50 dark:bg-slate-900' : ''}
                  `}
                >
                  <div className="flex gap-3">
                    {getNotificationIcon(notification.type || 'info')}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{notification.title}</h5>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.createdAt ? formatNotificationDate(notification.createdAt) : ''}
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
            onClick={() => navigate('/admin/notifications')}
          >
            Zobacz wszystkie
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
