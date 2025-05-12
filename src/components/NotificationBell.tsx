import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch notifications count
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching notifications count from Supabase...");
      
      // Test connection first
      const { error: connectionError } = await supabase
        .from('notifications')
        .select('count(*)', { count: 'exact', head: true });
      
      if (connectionError) {
        console.error("Connection error:", connectionError);
        setError("Nie udało się połączyć z bazą powiadomień");
        setLoading(false);
        return;
      }
      
      // Get unread notifications count
      const { count, error: countError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('is_read', false);
      
      if (countError) {
        console.error("Error fetching notification count:", countError);
        setError("Nie udało się pobrać liczby powiadomień");
        setLoading(false);
        return;
      }
      
      console.log("Unread notifications count:", count);
      setUnreadCount(count || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error in fetchNotifications:", err);
      setError("Problem z połączeniem sieciowym");
      setLoading(false);
    }
  }, []);

  // Check connection status on mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleClick = () => {
    if (error) {
      // If there's an error, retry fetching notifications
      handleRetry();
    } else {
      // Otherwise navigate to notifications page
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

  // Handle tooltip display
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleClick}
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
      
      {showTooltip && (
        <div className="absolute z-50 mt-2 right-0 bg-gray-800 text-white p-2 rounded shadow-lg text-xs max-w-xs">
          {error ? (
            <div>
              {error === "Problem z połączeniem sieciowym" ? 
                "Nie można połączyć z serwerem powiadomień. Brak połączenia internetowego lub serwer jest niedostępny." : 
                error}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="ml-2 bg-premium-purple px-2 py-1 rounded text-white hover:bg-black hover:text-white"
                disabled={retrying}
              >
                {retrying ? "Odświeżanie..." : "Odśwież"}
              </button>
            </div>
          ) : !loading && unreadCount === 0 ? (
            "Brak nowych powiadomień"
          ) : !loading && unreadCount > 0 ? (
            `Masz ${unreadCount} ${unreadCount === 1 ? 'nowe powiadomienie' : 
              unreadCount < 5 ? 'nowe powiadomienia' : 'nowych powiadomień'}`
          ) : (
            "Ładowanie powiadomień..."
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
