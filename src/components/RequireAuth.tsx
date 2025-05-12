
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/utils/AuthProvider";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Loading state
  if (loading) {
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
