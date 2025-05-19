
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/firebaseAuth";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const redirected = useRef(false);
  
  // Initialize auth check with a short timer to ensure auth state is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
      console.log("Auth initialized, user:", user);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  // Handle redirect to admin if already authenticated and on login page
  useEffect(() => {
    if (user && location.pathname === "/login" && isInitialized && !redirected.current) {
      console.log("User is authenticated on login page, redirecting to /admin");
      redirected.current = true;
    }
  }, [user, location.pathname, isInitialized]);
  
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
    console.log("No user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated - render the children directly
  console.log("User is authenticated, rendering children");
  return children;
};

export default RequireAuth;
