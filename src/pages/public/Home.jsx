import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Shield, Zap } from "lucide-react";
import {
  Button,
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Stack,
} from "../../components";

export default function Home() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-[#23407a]" />,
      title: "Deteksi Plagiarisme Canggih",
      description:
        "Teknologi AI terdepan untuk mendeteksi plagiarisme dengan akurasi tinggi menggunakan Winston AI.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#23407a]" />,
      title: "Manajemen Kelas Mudah",
      description:
        "Kelola kelas, tugas, dan siswa dengan antarmuka yang intuitif dan user-friendly.",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#23407a]" />,
      title: "Real-time Collaboration",
      description:
        "Editor real-time dengan auto-save dan monitoring langsung untuk pengalaman menulis yang optimal.",
    },
  ];

  const benefits = [
    "Deteksi plagiarisme dengan AI Winston",
    "Real-time collaboration dan monitoring",
    "Manajemen kelas yang mudah",
    "Export tugas dalam format PDF/DOCX",
    "Dashboard analytics yang komprehensif",
    "Integration dengan Google OAuth",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#23407a] to-[#1a2f5c] text-white">
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-1 mb-6">
              Platform Deteksi Plagiarisme untuk
              <span className="text-gradient-primary block mt-2">
                Dunia Akademik Modern
              </span>
            </h1>
            <p className="body-large mb-8 opacity-90">
              Protextify membantu institusi pendidikan mendeteksi plagiarisme
              dengan teknologi AI terdepan, mengelola kelas dengan mudah, dan
              memberikan pengalaman menulis yang optimal untuk siswa.
            </p>
            <Stack direction="row" spacing={4} justify="center" wrap>
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-[#23407a] hover:bg-gray-100"
                >
                  Mulai Gratis
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#23407a]"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </Stack>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Fitur Unggulan</h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Solusi lengkap untuk deteksi plagiarisme dan manajemen tugas
              akademik dengan teknologi terkini.
            </p>
          </div>

          <Grid cols={1} mdCols={3} gap={8}>
            {features.map((feature, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="mb-4">{feature.title}</CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <Container>
          <Grid cols={1} lgCols={2} gap={12} align="center">
            <div>
              <h2 className="heading-2 mb-6">Mengapa Memilih Protextify?</h2>
              <p className="body-large text-gray-600 mb-8">
                Platform yang dirancang khusus untuk kebutuhan akademik modern
                dengan teknologi AI yang canggih dan antarmuka yang mudah
                digunakan.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/auth/register">
                  <Button size="lg">
                    Daftar Sekarang
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <Card className="p-8">
                <CardHeader>
                  <CardTitle>Mulai Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Bergabunglah dengan ribuan pengguna yang sudah merasakan
                    manfaat Protextify untuk kebutuhan akademik mereka.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Untuk Siswa</span>
                      <span className="text-[#23407a] font-semibold">
                        Gratis
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Untuk Pengajar</span>
                      <span className="text-[#23407a] font-semibold">
                        Pay per Use
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link to="/auth/register">
                      <Button className="w-full">Buat Akun Gratis</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-[#23407a] text-white section-padding">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 mb-4">
              Siap Meningkatkan Kualitas Akademik?
            </h2>
            <p className="body-large mb-8 opacity-90">
              Bergabunglah dengan Protextify dan rasakan perbedaan dalam
              mengelola tugas akademik dan mendeteksi plagiarisme.
            </p>
            <Stack direction="row" spacing={4} justify="center" wrap>
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-[#23407a] hover:bg-gray-100"
                >
                  Daftar Gratis
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#23407a]"
                >
                  Masuk
                </Button>
              </Link>
            </Stack>
          </div>
        </Container>
      </section>
    </div>
  );
}
