
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/AuthProvider";
import { Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
  const [userRole, setUserRole] = useState<string | null>(null);
  const redirected = useRef(false);
  
  console.log("RequireAuth render:", { 
    user, 
    loading, 
    path: location.pathname, 
    requiredRole,
    pathname: location.pathname,
    userRole
  });
  
  // Fetch user role from Supabase
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user role:", error);
          return;
        }
        
        if (data && data.role) {
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Error in fetchUserRole:", err);
      }
    };
    
    if (user) {
      fetchUserRole();
    }
  }, [user]);
  
  // Initialize auth check with a short timer to ensure auth state is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
      console.log("Auth initialized, user:", user);
      
      // Check for role-based access if a role is required
      if (user && requiredRole && userRole) {
        // Check if the user has the required role or if they are an admin or administrator
        const hasRequiredRole = 
          userRole === requiredRole || 
          userRole === 'admin' || 
          userRole === 'administrator';
          
        if (!hasRequiredRole) {
          console.log("Access denied, required role:", requiredRole, "user role:", userRole);
          setAccessDenied(true);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, requiredRole, userRole]);
  
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
            {userRole && (
              <span className="block mt-2">
                Twoja rola: <strong>{userRole}</strong><br />
                Wymagana rola: <strong>{requiredRole}</strong>
              </span>
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              onClick={() => navigate("/admin")} 
              className="px-6 py-2 bg-premium-gradient text-white rounded-lg hover:bg-black hover:text-white"
            >
              Powrót do panelu
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              className="px-6 py-2 border border-gray-500 text-white rounded-lg hover:bg-black hover:text-white"
            >
              Strona główna
            </Button>
          </div>
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
