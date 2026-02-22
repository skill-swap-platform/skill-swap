import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps routes that should only be accessible to unauthenticated users
 * (login, register, verify-email).
 *
 * If the user already has a token → redirect to /home.
 */
const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
