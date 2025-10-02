import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  Code,
  Shield,
  ArrowRight,
} from "lucide-react";
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

export default function About() {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-[#23407a]" />,
      title: "Integritas Akademik",
      description:
        "Kami berkomitmen menjaga standar tertinggi dalam integritas akademik dan mendukung pembelajaran yang jujur.",
    },
    {
      icon: <Code className="h-8 w-8 text-[#23407a]" />,
      title: "Inovasi Teknologi",
      description:
        "Menggunakan teknologi AI terdepan untuk memberikan solusi deteksi plagiarisme yang akurat dan efisien.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#23407a]" />,
      title: "Kolaborasi",
      description:
        "Memfasilitasi kolaborasi yang sehat antara pengajar dan siswa dalam proses pembelajaran.",
    },
  ];

  const team = [
    {
      name: "Tim Pengembang",
      role: "Full-Stack Development",
      description:
        "Tim berpengalaman dalam mengembangkan solusi edtech yang inovatif.",
    },
    {
      name: "Tim AI Research",
      role: "Machine Learning & AI",
      description:
        "Ahli dalam teknologi deteksi plagiarisme dan natural language processing.",
    },
    {
      name: "Tim Product",
      role: "Product Management",
      description:
        "Memahami kebutuhan pendidikan dan merancang user experience yang optimal.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#23407a] to-[#1a2f5c] text-white">
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Tentang Protextify</h1>
            <p className="body-large opacity-90">
              Platform deteksi plagiarisme yang dirancang khusus untuk mendukung
              integritas akademik dan meningkatkan kualitas pembelajaran di era
              digital.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <Container>
          <Grid cols={1} lgCols={2} gap={12}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-8 w-8 text-[#23407a]" />
                  <CardTitle>Misi Kami</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Menyediakan solusi teknologi yang membantu institusi
                  pendidikan menjaga integritas akademik melalui deteksi
                  plagiarisme yang akurat, sambil memberikan pengalaman
                  pembelajaran yang modern dan efisien bagi pengajar dan siswa.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="h-8 w-8 text-[#23407a]" />
                  <CardTitle>Visi Kami</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi platform terdepan dalam solusi deteksi plagiarisme dan
                  manajemen tugas akademik di Indonesia, yang memungkinkan
                  setiap institusi pendidikan menciptakan lingkungan
                  pembelajaran yang jujur, inovatif, dan berkualitas tinggi.
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Nilai-nilai Kami</h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Prinsip-prinsip yang memandu setiap langkah pengembangan
              Protextify.
            </p>
          </div>

          <Grid cols={1} mdCols={3} gap={8}>
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <CardTitle className="mb-4">{value.title}</CardTitle>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Technology Section */}
      <section className="section-padding">
        <Container>
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Teknologi yang Kami Gunakan</h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Stack teknologi modern untuk performa dan keamanan optimal.
            </p>
          </div>

          <Grid cols={1} lgCols={2} gap={12} align="center">
            <div>
              <h3 className="heading-3 mb-6">Frontend</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>React 19.1.0 + Vite 7.1.7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>TailwindCSS 4.1.13</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>React Router DOM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>Socket.IO Client</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="heading-3 mb-6">Backend & AI</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>NestJS + TypeScript</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>PostgreSQL + Prisma ORM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>Winston AI API</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#23407a] rounded-full"></div>
                  <span>Redis + BullMQ</span>
                </div>
              </div>
            </div>
          </Grid>
        </Container>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Tim Kami</h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Profesional berpengalaman yang berdedikasi mengembangkan solusi
              terbaik.
            </p>
          </div>

          <Grid cols={1} mdCols={3} gap={8}>
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-[#23407a] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mb-2">{member.name}</CardTitle>
                  <p className="text-[#23407a] font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-[#23407a] text-white section-padding">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <Heart className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="heading-2 mb-4">Mari Bergabung dengan Protextify</h2>
            <p className="body-large mb-8 opacity-90">
              Mulai perjalanan Anda menuju pembelajaran yang lebih jujur dan
              berkualitas dengan teknologi deteksi plagiarisme terdepan.
            </p>
            <Stack direction="row" spacing={4} justify="center" wrap>
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-[#23407a] hover:bg-gray-100"
                >
                  Mulai Sekarang
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#23407a]"
                >
                  Sudah Punya Akun?
                </Button>
              </Link>
            </Stack>
          </div>
        </Container>
      </section>
    </div>
  );
}
