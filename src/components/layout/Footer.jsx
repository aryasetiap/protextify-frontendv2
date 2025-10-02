// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { Button, Container } from "../../components";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Tentang Kami", href: "/about" },
    { label: "Fitur", href: "/features" },
    { label: "Harga", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Karir", href: "/careers" },
  ];

  const support = [
    { label: "Bantuan", href: "/help" },
    { label: "Dokumentasi", href: "/docs" },
    { label: "Tutorial", href: "/tutorials" },
    { label: "API Reference", href: "/api-docs" },
    { label: "Status", href: "/status" },
  ];

  const legal = [
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ];

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Keamanan Terjamin",
      description: "Data Anda dilindungi dengan enkripsi tingkat enterprise",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Performa Tinggi",
      description: "Deteksi plagiarisme dalam hitungan detik",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Dukungan 24/7",
      description: "Tim support siap membantu kapan saja",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#0f1b3a] via-[#1a2f5c] to-[#23407a] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-float-delayed"></div>

      <Container className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Tetap Update dengan{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Protextify
              </span>
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Dapatkan tips terbaru tentang akademik, fitur baru, dan update
              platform langsung di inbox Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              <Button className="bg-white text-[#23407a] hover:bg-gray-100 px-6 py-3 font-medium">
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <p className="text-white/60 text-sm mt-4">
              * Tidak ada spam, hanya update penting saja
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="flex items-center mb-6">
                <img
                  src="/src/assets/logo-protextify-putih.png"
                  alt="Protextify"
                  className="h-16 w-auto"
                />
              </div>

              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                Platform deteksi plagiarisme dengan teknologi AI terdepan untuk
                institusi pendidikan. Membangun masa depan pendidikan yang lebih
                jujur dan berkualitas.
              </p>

              {/* Trust Indicators */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-blue-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-white/70 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-white/70">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a
                    href="mailto:support@protextify.com"
                    className="hover:text-white transition-colors"
                  >
                    support@protextify.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a
                    href="tel:+6285669644533"
                    className="hover:text-white transition-colors"
                  >
                    +62856-6964-4533
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>Bandar Lampung, Indonesia</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  {
                    icon: Mail,
                    href: "mailto:support@protextify.com",
                    label: "Email",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-6 text-white">
                    Platform
                  </h3>
                  <ul className="space-y-4">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-lg font-semibold mb-6 text-white">
                    Dukungan
                  </h3>
                  <ul className="space-y-4">
                    {support.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="text-lg font-semibold mb-6 text-white">
                    Legal
                  </h3>
                  <ul className="space-y-4">
                    {legal.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Card */}
              <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-3">Siap Memulai?</h4>
                <p className="text-white/70 mb-4">
                  Bergabunglah dengan ribuan institusi pendidikan yang
                  mempercayai Protextify.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/auth/register">
                    <Button className="bg-white text-[#23407a] hover:bg-gray-100">
                      Mulai Gratis
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Hubungi Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-white/70">
                © {currentYear} Protextify. Semua hak dilindungi.
              </p>
              <p className="text-white/60 text-sm mt-1">
                Terdaftar sebagai CV. Protextify Indonesia
              </p>
            </div>

            <div className="flex items-center space-x-6 text-white/60 text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span>Dibuat dengan cinta untuk pendidikan</span>
              </div>
              <div className="hidden md:block">|</div>
              <div className="flex items-center space-x-2">
                <span>🇮🇩</span>
                <span>Made in Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Compact Version */}
        <div className="lg:hidden">
          <div className="text-center space-y-8">
            {/* Brand */}
            <div>
              <img
                src="/src/assets/logo-protextify-putih.png"
                alt="Protextify"
                className="h-8 w-auto mx-auto mb-4"
              />
              <p className="text-white/80 max-w-xs mx-auto">
                Platform deteksi plagiarisme terdepan untuk pendidikan modern.
              </p>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2 text-sm">
                  {quickLinks.slice(0, 3).map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm">
                  {support.slice(0, 3).map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                {
                  icon: Mail,
                  href: "mailto:support@protextify.com",
                  label: "Email",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
