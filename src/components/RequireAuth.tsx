
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/AuthProvider";
import { Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
  requiredRole?: string;
}

const RequireAuth = ({ children, requiredRole }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const redirected = useRef(false);
  
  console.log("RequireAuth render:", { user, loading, path: location.pathname });
  
  // Initialize auth check with a short timer
  useEffect(() => {
    // Short timeout to allow auth state to load
    const timer = setTimeout(() => {
      setIsInitialized(true);
      console.log("Auth initialized");
      
      // Check for role-based access if a role is required
      if (user && requiredRole && user.role !== requiredRole) {
        setAccessDenied(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, requiredRole]);
  
  // Handle redirect to admin if already authenticated and on login page
  useEffect(() => {
    if (user && location.pathname === "/login" && isInitialized && !redirected.current) {
      console.log("User is authenticated on login page, redirecting to /admin");
      redirected.current = true;
      navigate("/admin", { replace: true });
    }
  }, [user, location.pathname, navigate, isInitialized]);
  
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
  
  // Show access denied message if user doesn't have required role
  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-premium-dark">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Brak uprawnień</h2>
          <p className="text-gray-300 mb-6">
            Nie posiadasz wymaganych uprawnień, aby zobaczyć tę stronę.
          </p>
          <button 
            onClick={() => navigate("/admin")} 
            className="px-6 py-2 bg-premium-gradient text-white rounded-lg hover:bg-white hover:text-black"
          >
            Powrót do panelu
          </button>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log("No user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated - IMPORTANT: return the children directly, don't navigate
  console.log("User is authenticated, rendering children");
  return children;
};

export default RequireAuth;
