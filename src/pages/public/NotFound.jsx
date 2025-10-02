import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getDefaultRoute } from "../../utils/constants";
import { Button, Container, Card, CardContent, Stack } from "../../components";

export default function NotFound() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getHomeRoute = () => {
    if (isAuthenticated && user) {
      return getDefaultRoute(user.role);
    }
    return "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container className="py-12">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-12">
              {/* 404 Illustration */}
              <div className="mb-8">
                <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
                <Search className="h-16 w-16 text-gray-300 mx-auto" />
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h1 className="heading-3 text-gray-900 mb-4">
                  Halaman Tidak Ditemukan
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin
                  halaman tersebut telah dipindahkan, dihapus, atau URL yang
                  Anda masukkan salah.
                </p>
              </div>

              {/* Action Buttons */}
              <Stack spacing={3}>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>

                <Link to={getHomeRoute()}>
                  <Button className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    {isAuthenticated ? "Dashboard" : "Beranda"}
                  </Button>
                </Link>
              </Stack>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  Butuh bantuan? Coba hal berikut:
                </p>
                <div className="text-left space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      Periksa ejaan URL yang Anda masukkan
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      Gunakan menu navigasi untuk menemukan halaman
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600">
                      Hubungi tim support jika masalah berlanjut
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
