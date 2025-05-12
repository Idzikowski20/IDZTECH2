import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/utils/notifications";
import { useToast } from "@/hooks/use-toast";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount, loading, error, refetchNotifications } = useNotifications();
  const { toast } = useToast();
  const [retrying, setRetrying] = useState(false);

  // Handle error in notification loading
  useEffect(() => {
    if (error) {
      console.error("Error loading notifications:", error);
    }
  }, [error]);

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
    try {
      await refetchNotifications();
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

  return (
    <div>
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
      
      {error && (
        <div className="absolute z-50 mt-2 right-14 bg-gray-800 text-white p-2 rounded shadow-lg text-xs">
          Nie udało się pobrać powiadomień.
          <button 
            onClick={handleRetry}
            className="ml-2 bg-premium-purple px-2 py-1 rounded text-white hover:bg-premium-purple/80"
            disabled={retrying}
          >
            {retrying ? "Odświeżanie..." : "Odśwież"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
