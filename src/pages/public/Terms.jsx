// src/pages/public/Terms.jsx
import { Link } from "react-router-dom";
import {
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Scale,
  Clock,
  Mail,
  ArrowRight,
  BookOpen,
  Users,
  CreditCard,
} from "lucide-react";
import {
  Button,
  Container,
  Card,
  CardContent,
  Badge,
} from "../../components";

export default function Terms() {
  const lastUpdated = "1 Oktober 2024";

  const sections = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Penerimaan Syarat",
      content: [
        {
          text: "Dengan mengakses dan menggunakan platform Protextify, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui syarat ini, harap tidak menggunakan layanan kami.",
        },
        {
          text: "Kami berhak untuk mengubah, memodifikasi, atau memperbarui syarat ini kapan saja. Perubahan akan efektif segera setelah diposting di platform. Penggunaan berkelanjutan setelah perubahan berarti Anda menerima syarat yang diperbarui.",
        },
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Akun Pengguna",
      content: [
        {
          subtitle: "Pendaftaran Akun",
          text: "Untuk menggunakan layanan Protextify, Anda harus membuat akun dengan informasi yang akurat dan lengkap. Anda bertanggung jawab menjaga keamanan akun dan password Anda.",
        },
        {
          subtitle: "Tanggung Jawab Pengguna",
          text: "Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda. Segera beritahu kami jika ada penggunaan tidak sah atau pelanggaran keamanan. Anda harus berusia minimal 18 tahun atau memiliki izin dari orang tua/wali untuk mendaftar.",
        },
        {
          subtitle: "Penangguhan Akun",
          text: "Kami berhak menangguhkan atau menghapus akun Anda jika Anda melanggar syarat ini, terlibat dalam aktivitas ilegal, atau perilaku yang merugikan platform atau pengguna lain.",
        },
      ],
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Penggunaan Layanan",
      content: [
        {
          subtitle: "Penggunaan yang Diizinkan",
          text: "Protextify menyediakan platform untuk deteksi plagiarisme dan manajemen tugas akademik. Anda dapat menggunakan layanan untuk tujuan pendidikan yang sah sesuai dengan hukum yang berlaku.",
        },
        {
          subtitle: "Batasan Penggunaan",
          text: "Anda tidak diizinkan untuk: (1) Menggunakan layanan untuk tujuan ilegal, (2) Mencoba mengakses sistem tanpa otorisasi, (3) Mengganggu atau merusak infrastruktur platform, (4) Menyalin, memodifikasi, atau mendistribusikan konten tanpa izin, (5) Menggunakan bot atau automated tools untuk mengakses layanan.",
        },
      ],
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Konten Pengguna",
      content: [
        {
          subtitle: "Kepemilikan Konten",
          text: "Anda mempertahankan semua hak atas konten yang Anda upload ke Protextify (dokumen, tugas, submission). Dengan meng-upload konten, Anda memberikan kami lisensi terbatas untuk menyimpan, memproses, dan menganalisis konten tersebut untuk menyediakan layanan.",
        },
        {
          subtitle: "Tanggung Jawab Konten",
          text: "Anda bertanggung jawab penuh atas konten yang Anda upload. Anda menjamin bahwa konten tidak melanggar hak cipta, trademark, atau hak kekayaan intelektual pihak lain, tidak mengandung materi ilegal atau berbahaya.",
        },
        {
          subtitle: "Penghapusan Konten",
          text: "Kami berhak menghapus konten yang melanggar syarat ini, melanggar hukum, atau dianggap tidak pantas tanpa pemberitahuan sebelumnya.",
        },
      ],
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Pembayaran dan Tagihan",
      content: [
        {
          subtitle: "Model Pembayaran",
          text: "Protextify menggunakan model pay-per-use dengan biaya Rp 2.700 per tugas per siswa. Pembayaran dilakukan di awal saat instructor membuat tugas baru.",
        },
        {
          subtitle: "Metode Pembayaran",
          text: "Kami menerima pembayaran melalui transfer bank, e-wallet (OVO, GoPay, Dana), dan kartu kredit. Semua transaksi diproses melalui payment gateway yang aman dan terenkripsi.",
        },
        {
          subtitle: "Refund dan Pembatalan",
          text: "Pembayaran yang sudah dikonfirmasi tidak dapat dibatalkan atau di-refund, kecuali ada kesalahan sistem dari pihak kami. Permintaan refund harus diajukan dalam 7 hari sejak transaksi dengan bukti yang valid.",
        },
        {
          subtitle: "Pajak",
          text: "Harga yang ditampilkan sudah termasuk pajak yang berlaku. Anda bertanggung jawab atas pajak tambahan yang mungkin berlaku di yurisdiksi Anda.",
        },
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Kekayaan Intelektual",
      content: [
        {
          subtitle: "Hak Protextify",
          text: "Semua hak kekayaan intelektual terkait platform Protextify, termasuk software, desain, logo, trademark, dan konten yang kami buat, adalah milik Protextify dan dilindungi oleh hukum kekayaan intelektual.",
        },
        {
          subtitle: "Lisensi Terbatas",
          text: "Kami memberikan Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan untuk menggunakan platform sesuai dengan syarat ini. Lisensi ini berakhir saat Anda berhenti menggunakan layanan atau akun Anda ditutup.",
        },
        {
          subtitle: "Larangan",
          text: "Anda tidak diizinkan untuk menyalin, memodifikasi, mendistribusikan, menjual, atau membuat karya turunan dari platform tanpa izin tertulis dari kami.",
        },
      ],
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Batasan Tanggung Jawab",
      content: [
        {
          subtitle: "Disclaimer",
          text: "Layanan disediakan \"sebagaimana adanya\" tanpa jaminan apapun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa layanan akan bebas error, aman, atau tidak terganggu.",
        },
        {
          subtitle: "Batasan Ganti Rugi",
          text: "Dalam keadaan apapun, Protextify tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan.",
        },
        {
          subtitle: "Maksimum Tanggung Jawab",
          text: "Total tanggung jawab kami kepada Anda untuk semua klaim yang timbul dari penggunaan layanan dibatasi pada jumlah yang Anda bayarkan kepada kami dalam 12 bulan terakhir.",
        },
      ],
    },
    {
      icon: <XCircle className="w-6 h-6" />,
      title: "Penghentian Layanan",
      content: [
        {
          subtitle: "Penghentian oleh Pengguna",
          text: "Anda dapat menghentikan penggunaan layanan dan menghapus akun Anda kapan saja melalui pengaturan akun atau dengan menghubungi support kami.",
        },
        {
          subtitle: "Penghentian oleh Protextify",
          text: "Kami berhak menghentikan atau menangguhkan akses Anda ke layanan tanpa pemberitahuan sebelumnya jika Anda melanggar syarat ini atau terlibat dalam aktivitas yang merugikan.",
        },
        {
          subtitle: "Efek Penghentian",
          text: "Setelah penghentian, hak Anda untuk mengakses dan menggunakan layanan akan segera berakhir. Data Anda akan dihapus sesuai dengan Kebijakan Privasi kami.",
        },
      ],
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Hukum yang Berlaku",
      content: [
        {
          subtitle: "Yurisdiksi",
          text: "Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia.",
        },
        {
          subtitle: "Penyelesaian Sengketa",
          text: "Jika terjadi sengketa, kami mendorong Anda untuk menghubungi kami terlebih dahulu untuk menyelesaikan masalah secara damai. Jika tidak dapat diselesaikan, sengketa akan diselesaikan melalui mediasi atau arbitrase sesuai hukum yang berlaku.",
        },
      ],
    },
  ];

  const quickGuide = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Yang Boleh Dilakukan",
      items: [
        "Menggunakan platform untuk tujuan pendidikan",
        "Upload konten yang Anda miliki haknya",
        "Berbagi kode kelas dengan siswa Anda",
        "Mengekspor hasil analisis untuk evaluasi",
      ],
      color: "green",
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      title: "Yang Tidak Boleh Dilakukan",
      items: [
        "Berbagi akun dengan orang lain",
        "Upload konten ilegal atau melanggar hak cipta",
        "Menggunakan bot atau automated tools",
        "Mencoba mengakses sistem tanpa otorisasi",
      ],
      color: "red",
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
                <FileText className="w-4 h-4 mr-2" />
                Syarat & Ketentuan
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Syarat &{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ketentuan Layanan
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Mohon baca syarat dan ketentuan ini dengan saksama sebelum
              menggunakan platform Protextify
            </p>

            {/* Last Updated */}
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Terakhir diperbarui: {lastUpdated}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Guide Section */}
      <section className="py-16 bg-white border-b">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Panduan Cepat
              </h2>
              <p className="text-gray-600">
                Ringkasan singkat tentang apa yang boleh dan tidak boleh
                dilakukan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickGuide.map((guide, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          guide.color === "green"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {guide.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {guide.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {guide.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className={`mt-1 ${
                              guide.color === "green"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            •
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
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
                  Selamat Datang di Protextify
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Syarat dan Ketentuan ini mengatur penggunaan platform
                    Protextify. Dengan mendaftar dan menggunakan layanan kami,
                    Anda menyetujui untuk terikat oleh syarat-syarat berikut.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Protextify adalah platform deteksi plagiarisme berbasis AI
                    yang dirancang untuk membantu institusi pendidikan menjaga
                    integritas akademik. Kami berkomitmen menyediakan layanan
                    terbaik dengan standar tertinggi.
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
                        {item.subtitle && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.subtitle}
                          </h3>
                        )}
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#23407a]/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#23407a] rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Pertanyaan tentang Syarat & Ketentuan?
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan
                      ini atau memerlukan klarifikasi, silakan hubungi tim
                      support kami:
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
                    <div className="flex gap-3">
                      <Link to="/help">
                        <Button className="bg-[#23407a] hover:bg-[#1a2f5c]">
                          Pusat Bantuan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to="/privacy">
                        <Button variant="outline">Kebijakan Privasi</Button>
                      </Link>
                    </div>
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

