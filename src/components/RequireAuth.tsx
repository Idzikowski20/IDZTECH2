
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/AuthProvider";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Dodajemy stan do kontrolowania przekierowań, aby zapobiec pętlom
  useEffect(() => {
    // Poczekamy krótko, aby dać czas na załadowanie stanu autoryzacji
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Tylko na stronie logowania i tylko gdy już wiemy, że użytkownik jest zalogowany
    if (isAuthenticated && user && location.pathname === "/login" && isInitialized) {
      console.log("User is authenticated, redirecting to /admin");
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate, isInitialized]);
  
  // Pokazujemy ekran ładowania, dopóki nie mamy pewności co do stanu autoryzacji
  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-premium-dark">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-premium-purple mx-auto mb-4" />
          <p className="text-gray-300">Ładowanie...</p>
        </div>
      </div>
    );
  }
  
  // Przekierowanie do logowania, gdy użytkownik nie jest zalogowany
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Użytkownik jest zalogowany
  return children;
};

export default RequireAuth;
