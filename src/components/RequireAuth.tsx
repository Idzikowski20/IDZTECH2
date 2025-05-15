
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/AuthContext";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface RequireAuthProps {
  children: JSX.Element;
  requiredRole?: string;
}

const RequireAuth = ({ children, requiredRole }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  
  // Only fetch role once when user is available
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setAccessChecked(true);
        return;
      }
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        setUserRole(data?.role || null);
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setAccessChecked(true);
      }
    };
    
    if (user && !userRole) {
      checkUserRole();
    } else {
      setAccessChecked(true);
    }
  }, [user]);
  
  // Show loading screen until auth is checked
  if (loading || !accessChecked) {
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
  
  // If role check is required and user doesn't have required role
  if (requiredRole && userRole && userRole !== requiredRole && 
      userRole !== 'admin' && userRole !== 'administrator') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-premium-dark">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Brak uprawnień</h2>
          <p className="text-gray-300 mb-6">
            Nie posiadasz wymaganych uprawnień, aby zobaczyć tę stronę.
          </p>
        </div>
      </div>
    );
  }
  
  // User is authenticated and has required role
  return children;
};

export default RequireAuth;
