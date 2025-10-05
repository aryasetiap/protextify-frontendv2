// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button, Container } from "../../components";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Tentang Kami", href: "/about" },
    // { label: "Fitur", href: "/features" },
    { label: "Harga", href: "/pricing" },
    // { label: "Blog", href: "/blog" },
  ];

  const support = [
    { label: "Bantuan", href: "/help" },
    { label: "Dokumentasi", href: "/docs" },
    { label: "Tutorial", href: "/tutorials" },
    { label: "Kontak", href: "/contact" },
  ];

  const legal = [
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a] text-white overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:40px_40px]"></div>

      {/* Subtle floating element */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

      <Container className="relative z-10">
        {/* Main Footer Content - Simplified */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section - Cleaner */}
            <div className="lg:col-span-4">
              <div className="flex items-center mb-6">
                <img
                  src="/src/assets/logo-protextify-putih.png"
                  alt="Protextify"
                  className="h-16 w-auto"
                />
              </div>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-sm">
                Platform deteksi plagiarisme dengan teknologi AI terdepan untuk
                institusi pendidikan.
              </p>

              {/* Contact - Minimal */}
              <div className="space-y-2 mb-8 text-sm">
                <a
                  href="mailto:support@protextify.com"
                  className="flex items-center text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 mr-3" />
                  support@protextify.com
                </a>
              </div>

              {/* Social Links - Cleaner */}
              <div className="flex space-x-3">
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
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections - Simplified */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Platform */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Platform</h3>
                  <ul className="space-y-3">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-white/60 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Dukungan</h3>
                  <ul className="space-y-3">
                    {support.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-white/60 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Legal</h3>
                  <ul className="space-y-3">
                    {legal.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-white/60 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA - Minimal */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">
                    Mulai Sekarang
                  </h3>
                  <div className="space-y-3">
                    <Link to="/auth/register">
                      <Button
                        size="sm"
                        className="w-full bg-white text-[#23407a] hover:bg-gray-100 text-sm mb-4"
                      >
                        Daftar Gratis
                      </Button>
                    </Link>
                    <Link to="/auth/login">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white/10 text-sm"
                      >
                        Masuk
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clean */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">
                © {currentYear} Protextify. All rights reserved.
              </p>
            </div>

            <div className="flex items-center text-white/50 text-sm">
              <Heart className="h-4 w-4 text-red-400 mr-2" />
              <span>Made with love in Indonesia</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
