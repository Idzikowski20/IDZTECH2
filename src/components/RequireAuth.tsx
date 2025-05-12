
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Make sure body scroll is always enabled
  useEffect(() => {
    document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Set initial load to true after a brief delay to ensure auth state is properly initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log("RequireAuth - auth state:", { 
      user: user ? "User exists" : "No user", 
      loading, 
      path: location.pathname,
      initialLoadComplete
    });
  }, [user, loading, location.pathname, initialLoadComplete]);

  // Display loading indicator while verifying the session
  if (loading || !initialLoadComplete) {
    return (
      <div className="flex items-center justify-center h-screen bg-premium-dark">
        <Loader2 className="h-12 w-12 animate-spin text-premium-purple" />
      </div>
    );
  }

  if (!user) {
    console.log("RequireAuth - redirecting to login");
    // Redirect to login if user is not logged in, and pass current location
    // Make sure we're not already on the login page to prevent redirect loops
    if (location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  console.log("RequireAuth - authorized, rendering children");
  return children;
};

export default RequireAuth;
