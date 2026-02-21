import { Navigate, useLocation } from "react-router-dom";
import type { UserAuthDto } from "@/types/api.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserAuthDto["role"][];
}

/**
 * Reads the access token and (optionally) the cached user from localStorage
 * to decide whether the user can access the wrapped route.
 *
 * - No token → redirect to /auth/login (preserving the intended destination)
 * - Token exists but role not allowed → redirect to /home
 * - Otherwise → render children
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Role-based guard (optional)
  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const userRaw = localStorage.getItem("user");
      const user: UserAuthDto | null = userRaw ? JSON.parse(userRaw) : null;

      if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/home" replace />;
      }
    } catch {
      // Malformed user data — let them through; the API will reject if needed
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
