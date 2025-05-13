
import { ReactNode } from "react";

interface RequireAuthProps {
  children: JSX.Element;
  requiredRole?: string;
}

// Simplified component that just renders children without auth checks
const RequireAuth = ({ children }: RequireAuthProps) => {
  return children;
};

export default RequireAuth;
