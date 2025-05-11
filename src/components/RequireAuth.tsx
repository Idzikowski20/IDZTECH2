
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect } from "react";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Make sure body scroll is always enabled
  useEffect(() => {
    document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log("RequireAuth - auth state:", { 
      user: user ? "User exists" : "No user", 
      loading, 
      path: location.pathname 
    });
  }, [user, loading, location.pathname]);

  if (loading) {
    // Display loading indicator while verifying the session
    return (
      <div className="flex items-center justify-center h-screen bg-premium-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
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
