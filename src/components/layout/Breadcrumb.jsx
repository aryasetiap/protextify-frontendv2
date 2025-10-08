import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const LABEL_MAP = {
  instructor: "Instructor",
  dashboard: "Dashboard",
  classes: "Kelas",
  "create-class": "Buat Kelas",
  settings: "Pengaturan",
  assignments: "Tugas",
  "create-assignment": "Buat Tugas",
  "write-assignment": "Tulis Tugas",
  submissions: "Submission",
  transactions: "Transaksi",
  profile: "Profil",
  help: "Bantuan",
  pricing: "Harga",
  about: "Tentang",
  docs: "Dokumentasi",
  privacy: "Kebijakan Privasi",
  terms: "Syarat & Ketentuan",
};

export default function Breadcrumb({ customItems = null, showHome = true }) {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (showHome) {
      breadcrumbs.push({ label: "Home", path: "/" });
    }

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Mapping label sesuai fitur BE
      let label = LABEL_MAP[segment] || segment.replace(/-/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);

      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? null : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on home page
  if (location.pathname === "/" || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm mb-6">
      <div className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-gray-400 mx-2" />
            )}

            {crumb.path ? (
              <Link
                to={crumb.path}
                className="hover:text-[#23407a] transition-colors flex items-center text-gray-600 hover:bg-[#23407a]/10 px-2 py-1 rounded-md"
              >
                {index === 0 && showHome && <Home className="h-3 w-3 mr-1" />}
                <span className="font-medium">{crumb.label}</span>
              </Link>
            ) : (
              <span className="text-[#23407a] font-semibold flex items-center px-2 py-1 bg-[#23407a]/10 rounded-md">
                {index === 0 && showHome && <Home className="h-3 w-3 mr-1" />}
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
