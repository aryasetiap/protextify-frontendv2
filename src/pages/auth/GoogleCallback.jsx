import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services";
import {
  LoadingSpinner,
  Container,
  Card,
  CardContent,
  Alert,
} from "../../components";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dispatch } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        const errorMessage = errorDescription || "Google login failed";
        dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
        toast.error(`Login Google gagal: ${errorMessage}`);
        navigate("/login", { replace: true });
        return;
      }

      if (token) {
        try {
          // Store token
          localStorage.setItem("token", token);

          // Get user info
          const user = await authService.getCurrentUser();

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          });

          toast.success(`Selamat datang, ${user.fullName}!`);
          
          // Redirect based on user role
          const redirectPath = user.role === "INSTRUCTOR" 
            ? "/instructor/dashboard" 
            : "/dashboard";
            
          navigate(redirectPath, { replace: true });
        } catch (error) {
          console.error("Failed to get user info:", error);
          dispatch({ 
            type: "LOGIN_ERROR", 
            payload: "Gagal mendapatkan informasi pengguna" 
          });
          localStorage.removeItem("token");
          toast.error("Gagal mendapatkan informasi pengguna");
          navigate("/login", { replace: true });
        }
      } else {
        dispatch({ 
          type: "LOGIN_ERROR", 
          payload: "Token tidak ditemukan" 
        });
        toast.error("Token tidak ditemukan");
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <div className="mb-6">
                <img
                  className="mx-auto h-16 w-auto"
                  src="/src/assets/logo-protextify.png"
                  alt="Protextify"
                />
              </div>
              
              <LoadingSpinner size="lg" className="mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Memproses Login Google
              </h2>
              <p className="text-gray-600">
                Mohon tunggu, kami sedang memverifikasi akun Google Anda...
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default GoogleCallback;
