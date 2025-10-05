// src/pages/public/Privacy.jsx
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  Database,
  FileText,
  UserCheck,
  Clock,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  Button,
  Container,
  Card,
  CardContent,
  Badge,
} from "../../components";

export default function Privacy() {
  const lastUpdated = "1 Oktober 2024";

  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Informasi yang Kami Kumpulkan",
      content: [
        {
          subtitle: "Informasi Pribadi",
          text: "Kami mengumpulkan informasi yang Anda berikan saat mendaftar, termasuk nama, email, nomor telepon, dan informasi institusi. Untuk pembayaran, kami mengumpulkan informasi billing yang diperlukan melalui payment gateway yang aman.",
        },
        {
          subtitle: "Informasi Akademik",
          text: "Kami menyimpan data terkait kelas, tugas, submission, dan hasil deteksi plagiarisme. Semua konten yang di-upload siswa disimpan dengan enkripsi untuk menjaga keamanan dan privasi.",
        },
        {
          subtitle: "Informasi Teknis",
          text: "Kami mengumpulkan data teknis seperti IP address, browser type, device information, dan log aktivitas untuk meningkatkan keamanan dan performa platform.",
        },
      ],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Bagaimana Kami Menggunakan Informasi",
      content: [
        {
          subtitle: "Penyediaan Layanan",
          text: "Informasi Anda digunakan untuk menyediakan, memelihara, dan meningkatkan layanan Protextify, termasuk deteksi plagiarisme, manajemen kelas, dan analytics.",
        },
        {
          subtitle: "Komunikasi",
          text: "Kami menggunakan email Anda untuk mengirim notifikasi penting terkait akun, update layanan, dan informasi keamanan. Anda dapat opt-out dari email marketing kapan saja.",
        },
        {
          subtitle: "Analisis dan Peningkatan",
          text: "Data agregat dan anonim digunakan untuk menganalisis penggunaan platform, mengidentifikasi tren, dan meningkatkan fitur serta user experience.",
        },
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Keamanan Data",
      content: [
        {
          subtitle: "Enkripsi End-to-End",
          text: "Semua data sensitif dienkripsi saat transit (SSL/TLS) dan saat disimpan (AES-256). Dokumen siswa dan hasil plagiarisme dilindungi dengan standar keamanan tertinggi.",
        },
        {
          subtitle: "Akses Terbatas",
          text: "Hanya personel yang berwenang yang memiliki akses ke data pengguna, dan semua akses dicatat untuk audit. Kami menggunakan role-based access control (RBAC).",
        },
        {
          subtitle: "Backup dan Recovery",
          text: "Data di-backup secara reguler dan disimpan di multiple locations untuk mencegah kehilangan data. Kami memiliki disaster recovery plan yang teruji.",
        },
      ],
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Berbagi Informasi",
      content: [
        {
          subtitle: "Tidak Dijual ke Pihak Ketiga",
          text: "Kami TIDAK PERNAH menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan marketing mereka.",
        },
        {
          subtitle: "Service Providers",
          text: "Kami berbagi data dengan service providers terpercaya yang membantu operasional platform (hosting, payment gateway, email service) dengan perjanjian ketat tentang perlindungan data.",
        },
        {
          subtitle: "Kepatuhan Hukum",
          text: "Kami dapat mengungkapkan informasi jika diwajibkan oleh hukum, perintah pengadilan, atau untuk melindungi hak dan keamanan Protextify dan penggunanya.",
        },
      ],
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Hak Pengguna",
      content: [
        {
          subtitle: "Akses dan Koreksi",
          text: "Anda berhak mengakses, mengoreksi, atau memperbarui informasi pribadi Anda kapan saja melalui pengaturan akun atau dengan menghubungi support kami.",
        },
        {
          subtitle: "Penghapusan Data",
          text: "Anda dapat meminta penghapusan akun dan data pribadi Anda. Kami akan menghapus data dalam 30 hari, kecuali data yang wajib disimpan untuk kepatuhan hukum.",
        },
        {
          subtitle: "Portabilitas Data",
          text: "Anda dapat meminta salinan data Anda dalam format yang dapat dibaca mesin untuk dipindahkan ke platform lain.",
        },
        {
          subtitle: "Opt-out Marketing",
          text: "Anda dapat berhenti menerima email marketing dengan klik unsubscribe di email atau melalui pengaturan notifikasi di akun Anda.",
        },
      ],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Retensi Data",
      content: [
        {
          subtitle: "Data Aktif",
          text: "Data Anda disimpan selama akun masih aktif dan selama diperlukan untuk menyediakan layanan yang Anda gunakan.",
        },
        {
          subtitle: "Data Tidak Aktif",
          text: "Setelah akun dihapus atau tidak aktif selama 2 tahun, kami akan menghapus data pribadi Anda, kecuali data yang wajib disimpan untuk audit atau kepatuhan hukum.",
        },
        {
          subtitle: "Data Backup",
          text: "Data dalam backup dapat tersimpan hingga 90 hari setelah penghapusan dari sistem produksi, sesuai dengan disaster recovery policy kami.",
        },
      ],
    },
  ];

  const principles = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Transparansi",
      description: "Kami terbuka tentang data yang kami kumpulkan dan bagaimana penggunaannya",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Keamanan",
      description: "Perlindungan data dengan enkripsi dan standar keamanan tertinggi",
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Kontrol Pengguna",
      description: "Anda memiliki kontrol penuh atas data pribadi Anda",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Privasi by Design",
      description: "Privasi diintegrasikan dalam setiap aspek platform kami",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>

        <Container className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <Badge
                variant="glass"
                className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Kebijakan Privasi
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Privasi Anda adalah{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Prioritas Kami
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Kami berkomitmen melindungi data dan privasi Anda dengan standar
              keamanan tertinggi
            </p>

            {/* Last Updated */}
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Terakhir diperbarui: {lastUpdated}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Principles Section */}
      <section className="py-16 bg-white border-b">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((principle, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#23407a]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#23407a]">
                      {principle.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tentang Kebijakan Privasi Ini
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Selamat datang di Protextify. Kebijakan Privasi ini
                    menjelaskan bagaimana kami mengumpulkan, menggunakan,
                    melindungi, dan berbagi informasi pribadi Anda saat
                    menggunakan platform kami.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Dengan menggunakan Protextify, Anda menyetujui praktik yang
                    dijelaskan dalam kebijakan ini. Kami mendorong Anda untuk
                    membaca kebijakan ini secara menyeluruh dan menghubungi kami
                    jika ada pertanyaan.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Sections */}
            {sections.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#23407a]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#23407a]">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Changes to Policy */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Perubahan pada Kebijakan Privasi
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                  waktu untuk mencerminkan perubahan dalam praktik kami atau
                  persyaratan hukum. Kami akan memberi tahu Anda tentang
                  perubahan signifikan melalui email atau notifikasi di platform.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Tanggal "Terakhir diperbarui" di bagian atas halaman ini
                  menunjukkan kapan kebijakan ini terakhir direvisi. Penggunaan
                  berkelanjutan platform setelah perubahan berarti Anda
                  menerima kebijakan yang diperbarui.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#23407a]/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#23407a] rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Hubungi Kami
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Jika Anda memiliki pertanyaan tentang Kebijakan Privasi
                      ini, praktik data kami, atau ingin menggunakan hak privasi
                      Anda, silakan hubungi kami:
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-[#23407a]" />
                        <a
                          href="mailto:support@protextify.com"
                          className="hover:text-[#23407a] transition-colors"
                        >
                          support@protextify.com
                        </a>
                      </div>
                    </div>
                    <Link to="/help">
                      <Button className="bg-[#23407a] hover:bg-[#1a2f5c]">
                        Pusat Bantuan
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}

