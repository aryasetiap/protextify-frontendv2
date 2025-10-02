import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { LoadingSpinner, Container, Alert } from "./ui";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container className="py-12">
          <div className="max-w-md mx-auto text-center">
            <Alert variant="error" title="Akses Ditolak">
              <p>
                Anda tidak memiliki izin untuk mengakses halaman ini. Halaman
                ini khusus untuk role: {allowedRoles.join(", ")}.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => window.history.back()}
                  className="text-[#23407a] hover:text-[#1a2f5c] font-medium"
                >
                  Kembali
                </button>
              </div>
            </Alert>
          </div>
        </Container>
      </div>
    );
  }

  // Return children or Outlet for nested routes
  return children || <Outlet />;
};

export default ProtectedRoute;
