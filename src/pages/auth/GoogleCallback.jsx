import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "../../components/ui";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dispatch } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        dispatch({ type: "LOGIN_ERROR", payload: "Google login failed" });
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

          navigate("/dashboard", { replace: true });
        } catch (error) {
          dispatch({ type: "LOGIN_ERROR", payload: "Failed to get user info" });
          navigate("/login", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Memproses login Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
