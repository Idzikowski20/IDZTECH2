
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user_id?: string;
  target_id?: string;
  target_type?: string;
}

const NotificationBell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error("Error fetching notifications:", fetchError);
        setError("Nie udało się pobrać powiadomień");
        setLoading(false);
        return;
      }

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Problem z połączeniem sieciowym");
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription for notifications
  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClick = () => {
    if (error) {
      handleRetry();
    } else {
      navigate("/admin/notifications");
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setError(null);
    try {
      await fetchNotifications();
      toast({
        title: "Odświeżono",
        description: "Powiadomienia zostały pomyślnie odświeżone",
      });
    } catch (err) {
      console.error("Failed to refresh notifications:", err);
      setError("Nie udało się odświeżyć powiadomień");
      toast({
        title: "Błąd",
        description: "Nie udało się odświeżyć powiadomień",
        variant: "destructive",
      });
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {loading || retrying ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        ) : (
          <>
            <Bell className="h-5 w-5" />
            {error ? (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                !
              </span>
            ) : unreadCount > 0 ? (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 min-w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </>
        )}
      </Button>
      
      {(showTooltip || error) && (
        <div className="absolute z-50 mt-2 right-14 bg-gray-800 text-white p-2 rounded shadow-lg text-xs">
          {error ? (
            <>
              {error === "Problem z połączeniem sieciowym" ? 
                "Nie można połączyć z serwerem powiadomień. Brak połączenia internetowego lub serwer jest niedostępny." : 
                error}
              <button 
                onClick={handleRetry}
                className="ml-2 bg-premium-purple px-2 py-1 rounded text-white hover:bg-black hover:text-white"
                disabled={retrying}
              >
                {retrying ? "Odświeżanie..." : "Odśwież"}
              </button>
            </>
          ) : (
            unreadCount === 0 ? "Brak nowych powiadomień" : `Masz ${unreadCount} ${unreadCount === 1 ? 'nowe powiadomienie' : 'nowych powiadomień'}`
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
