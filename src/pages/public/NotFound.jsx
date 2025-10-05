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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white">
              <Search className="w-4 h-4 mr-2" />
              Halaman Tidak Ditemukan
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Oops!{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Halaman Tidak Ditemukan
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Maaf, halaman yang Anda cari tidak tersedia. Mungkin sudah
            dipindahkan, dihapus, atau URL yang Anda masukkan salah.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button
              size="xl"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </Button>
            <Link to={getHomeRoute()}>
              <Button className="group bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                {isAuthenticated ? "Dashboard" : "Beranda"}
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/70 mb-4">
              Butuh bantuan? Coba hal berikut:
            </p>
            <div className="text-left space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-white/80">
                  Periksa ejaan URL yang Anda masukkan
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-white/80">
                  Gunakan menu navigasi untuk menemukan halaman
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-white/80">
                  Hubungi tim support jika masalah berlanjut
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
