import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button, Container, Card, CardContent, Stack } from "./ui";

export default function ErrorBoundary() {
  const error = useRouteError();

  const handleReload = () => {
    window.location.reload();
  };

  const getErrorInfo = () => {
    if (error?.status === 404) {
      return {
        title: "Halaman Tidak Ditemukan",
        message: "Halaman yang Anda cari tidak dapat ditemukan.",
        showDetails: false,
      };
    }

    if (error?.status >= 500) {
      return {
        title: "Terjadi Kesalahan Server",
        message:
          "Maaf, terjadi kesalahan pada server. Silakan coba lagi nanti.",
        showDetails: true,
      };
    }

    return {
      title: "Terjadi Kesalahan",
      message:
        "Maaf, terjadi kesalahan tak terduga. Silakan muat ulang halaman.",
      showDetails: true,
    };
  };

  const { title, message, showDetails } = getErrorInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container className="py-12">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-12">
              {/* Error Icon */}
              <div className="mb-8">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h1 className="heading-3 text-gray-900 mb-4">{title}</h1>
                <p className="text-gray-600 leading-relaxed">{message}</p>
              </div>

              {/* Error Details (in development) */}
              {showDetails && import.meta.env.DEV && error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <h3 className="font-medium text-red-900 mb-2">
                    Error Details:
                  </h3>
                  <div className="text-sm text-red-800 space-y-1">
                    {error.status && (
                      <p>
                        <strong>Status:</strong> {error.status}
                      </p>
                    )}
                    {error.statusText && (
                      <p>
                        <strong>Status Text:</strong> {error.statusText}
                      </p>
                    )}
                    {error.message && (
                      <p>
                        <strong>Message:</strong> {error.message}
                      </p>
                    )}
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">
                          Stack Trace
                        </summary>
                        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <Stack spacing={3}>
                <Button onClick={handleReload} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Muat Ulang
                </Button>

                <Link to="/">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Kembali ke Beranda
                  </Button>
                </Link>
              </Stack>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Jika masalah berlanjut, silakan hubungi tim support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
