import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { USER_ROLES } from "../../utils/constants";

export default function Breadcrumb({ customItems = null, showHome = true }) {
  const location = useLocation();
  const { user } = useAuth();

  // Route mappings untuk breadcrumb labels
  const routeLabels = {
    // Public routes
    "/": "Beranda",
    "/about": "Tentang",

    // Auth routes
    "/auth/login": "Masuk",
    "/auth/register": "Daftar",
    "/auth/email-verification": "Verifikasi Email",

    // Student routes
    "/dashboard": "Dashboard",
    "/dashboard/overview": "Dashboard",
    "/dashboard/classes": "Kelas Saya",
    "/dashboard/join-class": "Gabung Kelas",
    "/dashboard/assignments": "Tugas Saya",
    "/dashboard/submissions": "Riwayat Pengumpulan",

    // Instructor routes
    "/instructor": "Instructor",
    "/instructor/dashboard": "Dashboard",
    "/instructor/classes": "Kelola Kelas",
    "/instructor/create-class": "Buat Kelas",
    "/instructor/analytics": "Analytics",
    "/instructor/settings": "Pengaturan",
  };

  // Dynamic route patterns
  const getDynamicLabel = (pathname) => {
    // For assignment writing
    if (pathname.includes("/assignments/") && pathname.includes("/write")) {
      return "Tulis Tugas";
    }

    // For class detail
    if (
      pathname.startsWith("/instructor/classes/") &&
      !pathname.includes("/create-assignment")
    ) {
      return "Detail Kelas";
    }

    // For create assignment
    if (pathname.includes("/create-assignment")) {
      return "Buat Tugas";
    }

    // For assignment detail
    if (pathname.startsWith("/instructor/assignments/")) {
      if (pathname.includes("/monitor")) {
        return "Monitor Pengumpulan";
      }
      return "Detail Tugas";
    }

    return null;
  };

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Add home if needed
    if (showHome) {
      const homeRoute =
        user?.role === USER_ROLES.INSTRUCTOR
          ? "/instructor/dashboard"
          : "/dashboard/overview";
      breadcrumbs.push({
        label: "Dashboard",
        path: homeRoute,
        icon: Home,
      });
    }

    // Build breadcrumb from current path
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip if it's the home route we already added
      if (
        showHome &&
        (currentPath === "/dashboard" || currentPath === "/instructor")
      ) {
        return;
      }

      // Get label for current path
      let label =
        routeLabels[currentPath] || getDynamicLabel(location.pathname);

      // Fallback for unknown routes
      if (!label) {
        label =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      }

      // Determine if it's the last item (current page)
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        label,
        path: isLast ? null : currentPath, // No link for current page
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
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}

          {crumb.path ? (
            <Link
              to={crumb.path}
              className="hover:text-[#23407a] transition-colors flex items-center"
            >
              {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium flex items-center">
              {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Hook for custom breadcrumb usage
export const useBreadcrumb = () => {
  const setBreadcrumb = (items) => {
    // This can be enhanced with context if needed
    return items;
  };

  return { setBreadcrumb };
};
