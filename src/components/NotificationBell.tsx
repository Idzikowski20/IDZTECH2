
import { useState, useCallback } from "react";
import { Bell, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useNotificationService } from "@/hooks/useNotificationService";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    unreadCount, 
    loading, 
    error, 
    isOfflineMode,
    fetchNotifications 
  } = useNotificationService();
  const [showTooltip, setShowTooltip] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleClick = () => {
    if (error || isOfflineMode) {
      // If there's an error, retry fetching notifications
      handleRetry();
    } else {
      // Otherwise navigate to notifications page
      navigate("/admin/notifications");
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await fetchNotifications();
      toast({
        title: "Odświeżono",
        description: "Powiadomienia zostały pomyślnie odświeżone",
      });
    } catch (err) {
      console.error("Failed to refresh notifications:", err);
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
            {isOfflineMode ? (
              <WifiOff className="h-5 w-5 text-amber-500" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            
            {error || isOfflineMode ? (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-amber-500 rounded-full">
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
              {error}
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
          ) : isOfflineMode ? (
            <div>
              Tryb offline - niektóre funkcje są ograniczone
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="ml-2 bg-premium-purple px-2 py-1 rounded text-white hover:bg-black hover:text-white"
                disabled={retrying}
              >
                {retrying ? "Sprawdzanie..." : "Sprawdź połączenie"}
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
