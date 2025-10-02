import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { authService } from "../../services";
import { toast } from "react-hot-toast";
import {
  Button,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Container,
  LoadingSpinner,
} from "../../components";

export default function EmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("pending"); // pending, success, error, loading
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const email = location.state?.email || "";
  const justRegistered = location.state?.justRegistered || false;
  const verificationToken = searchParams.get("token");

  useEffect(() => {
    // If there's a token in URL, verify it automatically
    if (verificationToken) {
      verifyEmail(verificationToken);
    }
  }, [verificationToken]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyEmail = async (token) => {
    setStatus("loading");
    try {
      await authService.verifyEmail(token);
      setStatus("success");
      toast.success("Email berhasil diverifikasi!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Email berhasil diverifikasi. Silakan login." },
        });
      }, 3000);
    } catch (error) {
      setStatus("error");
      toast.error(
        "Verifikasi email gagal. Token mungkin tidak valid atau sudah kadaluarsa."
      );
    }
  };

  const resendVerification = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    try {
      await authService.sendVerification(email);
      toast.success("Email verifikasi telah dikirim ulang!");
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      toast.error("Gagal mengirim ulang email verifikasi.");
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <LoadingSpinner size="lg" className="text-[#23407a]" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-[#23407a]" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return {
          title: "Memverifikasi Email...",
          description: "Mohon tunggu, kami sedang memverifikasi email Anda.",
        };
      case "success":
        return {
          title: "Email Berhasil Diverifikasi!",
          description:
            "Akun Anda telah aktif. Anda akan diarahkan ke halaman login dalam beberapa detik.",
        };
      case "error":
        return {
          title: "Verifikasi Gagal",
          description:
            "Token verifikasi tidak valid atau sudah kadaluarsa. Silakan minta link verifikasi baru.",
        };
      default:
        return {
          title: justRegistered ? "Cek Email Anda" : "Verifikasi Email",
          description: justRegistered
            ? `Kami telah mengirim link verifikasi ke ${email}. Silakan cek email Anda dan klik link untuk mengaktifkan akun.`
            : "Silakan cek email Anda untuk link verifikasi atau minta link baru.",
        };
    }
  };

  const { title, description } = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center pb-6">
              <div className="mb-6">
                <img
                  className="mx-auto h-16 w-auto"
                  src="/src/assets/logo-protextify.png"
                  alt="Protextify"
                />
              </div>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">{getStatusIcon()}</div>

              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  {title}
                </CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {status === "pending" && email && (
                <div className="space-y-4">
                  <Alert variant="info" title="Tidak menerima email?">
                    <ul className="text-sm text-left mt-2 space-y-1">
                      <li>• Cek folder spam/junk</li>
                      <li>• Pastikan email {email} benar</li>
                      <li>• Tunggu beberapa menit</li>
                    </ul>
                  </Alert>

                  <Button
                    onClick={resendVerification}
                    variant="outline"
                    className="w-full"
                    disabled={countdown > 0 || isResending}
                    loading={isResending}
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Kirim ulang dalam {countdown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Kirim Ulang Email
                      </>
                    )}
                  </Button>
                </div>
              )}

              {status === "error" && email && (
                <Button
                  onClick={resendVerification}
                  className="w-full"
                  disabled={countdown > 0 || isResending}
                  loading={isResending}
                >
                  {countdown > 0
                    ? `Kirim ulang dalam ${countdown}s`
                    : "Minta Link Verifikasi Baru"}
                </Button>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <Alert variant="success" title="Berhasil!">
                    Akun Anda telah aktif dan siap digunakan.
                  </Alert>

                  <Button onClick={() => navigate("/login")} className="w-full">
                    Lanjut ke Login
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Kembali ke Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
