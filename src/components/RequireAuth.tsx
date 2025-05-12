
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
  
  // Add a state to control redirects to prevent loops
  useEffect(() => {
    // Short timeout to allow auth state to load
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500); // Increased timeout to ensure auth state is fully loaded
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Only redirect from login page when we're initialized and have user data
    if (isAuthenticated && user && location.pathname === "/login" && isInitialized) {
      console.log("User is authenticated, redirecting to /admin");
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate, isInitialized]);
  
  // Show loading screen until we're sure about auth state
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
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated
  return children;
};

export default RequireAuth;
