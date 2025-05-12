
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
  
  // Always enable body scroll
  useEffect(() => {
    document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Set initial load to complete after a delay to ensure auth state is initialized
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Add debug logging
  useEffect(() => {
    console.log("RequireAuth - auth state:", { 
      user: user ? "User exists" : "No user", 
      loading, 
      path: location.pathname,
      initialLoadComplete
    });
  }, [user, loading, location.pathname, initialLoadComplete]);
  
  // Display loading indicator while auth is being verified
  if (loading || !initialLoadComplete) {
    return (
      <div className="flex items-center justify-center h-screen bg-premium-dark">
        <Loader2 className="h-12 w-12 animate-spin text-premium-purple" />
      </div>
    );
  }
  
  // Redirect to login if user is not authenticated
  if (!user) {
    console.log("RequireAuth - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("RequireAuth - authorized, rendering children");
  return children;
};

export default RequireAuth;
