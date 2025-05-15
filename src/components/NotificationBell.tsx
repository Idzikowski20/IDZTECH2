import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/utils/notifications";
import { useToast } from "@/hooks/use-toast";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount, fetchNotifications } = useNotifications();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

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
      setRetrying(false);
    } catch (err) {
      console.error("Failed to refresh notifications:", err);
      setError("Nie udało się odświeżyć powiadomień");
      toast({
        title: "Błąd",
        description: "Nie udało się odświeżyć powiadomień",
        variant: "destructive",
      });
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
          {error}
          <button 
            onClick={handleRetry}
            className="ml-2 bg-premium-purple px-2 py-1 rounded text-white hover:bg-black hover:text-white"
            disabled={retrying}
          >
            {retrying ? "Odświeżanie..." : "Odśwież"}
          </button>
        </div>
      )}
      
      {!error && !loading && unreadCount === 0 && (
        <div className="absolute z-50 mt-2 right-14 bg-gray-800 text-white p-2 rounded shadow-lg text-xs">
          Brak nowych powiadomień
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
