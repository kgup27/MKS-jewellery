import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const location = useLocation();

  const { admin, loading } = useAuth();

  // Auth check hone tak wait karo
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Login nahi hai to login page pe bhej do
  if (!admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Login hai to requested page dikhao
  return <Outlet />;
}

export default ProtectedRoute;