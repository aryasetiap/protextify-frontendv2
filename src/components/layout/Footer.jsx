import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/src/assets/logo-protextify.png"
                alt="Protextify"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-[#23407a]">
                Protextify
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Platform deteksi plagiarisme dengan teknologi AI terdepan untuk
              institusi pendidikan. Mendukung integritas akademik dan
              pembelajaran yang berkualitas.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-gray-400 hover:text-[#23407a] transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#23407a] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#23407a] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@protextify.com"
                className="text-gray-400 hover:text-[#23407a] transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Harga
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Dukungan
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Bantuan
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-600 hover:text-[#23407a] transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} Protextify. Semua hak dilindungi.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                Dibuat dengan ❤️ untuk pendidikan yang lebih baik
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
