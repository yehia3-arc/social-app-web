import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userLogin } = useContext(AuthContext); // reactive → updates on login/logout instantly
  if (!userLogin) return <Navigate to="/login" replace />; // real URL change
  return <>{children}</>;
}
