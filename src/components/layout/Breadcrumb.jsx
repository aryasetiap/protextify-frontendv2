import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

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

      // Create readable labels
      let label = segment.replace(/-/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);

      // Handle specific cases
      if (segment === "instructor") label = "Instructor";
      if (segment === "dashboard") label = "Dashboard";
      if (segment === "classes") label = "Kelas";
      if (segment === "create-class") label = "Buat Kelas";
      if (segment === "settings") label = "Pengaturan";

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
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}

          {crumb.path ? (
            <Link
              to={crumb.path}
              className="hover:text-[#23407a] transition-colors flex items-center"
            >
              {index === 0 && showHome && <Home className="h-4 w-4 mr-1" />}
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium flex items-center">
              {index === 0 && showHome && <Home className="h-4 w-4 mr-1" />}
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
