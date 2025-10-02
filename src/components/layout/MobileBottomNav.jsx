// src/components/layout/MobileBottomNav.jsx
// filepath: src/components/layout/MobileBottomNav.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, FileText, User, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/helpers";

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const getNavItems = () => {
    if (user?.role === "INSTRUCTOR") {
      return [
        {
          icon: Home,
          label: "Home",
          href: "/instructor/dashboard",
          active: location.pathname === "/instructor/dashboard",
        },
        {
          icon: BookOpen,
          label: "Kelas",
          href: "/instructor/classes",
          active: location.pathname.startsWith("/instructor/classes"),
        },
        {
          icon: Plus,
          label: "Buat",
          href: "/instructor/create-class",
          active: location.pathname === "/instructor/create-class",
          isPrimary: true,
        },
        {
          icon: FileText,
          label: "Transaksi",
          href: "/instructor/transactions",
          active: location.pathname.startsWith("/instructor/transactions"),
        },
        {
          icon: User,
          label: "Profil",
          href: "/profile",
          active: location.pathname === "/profile",
        },
      ];
    } else {
      return [
        {
          icon: Home,
          label: "Home",
          href: "/dashboard",
          active: location.pathname === "/dashboard",
        },
        {
          icon: BookOpen,
          label: "Kelas",
          href: "/dashboard/classes",
          active: location.pathname.startsWith("/dashboard/classes"),
        },
        {
          icon: Plus,
          label: "Gabung",
          href: "/dashboard/join-class",
          active: location.pathname === "/dashboard/join-class",
          isPrimary: true,
        },
        {
          icon: FileText,
          label: "Tugas",
          href: "/dashboard/assignments",
          active: location.pathname.startsWith("/dashboard/assignments"),
        },
        {
          icon: User,
          label: "Profil",
          href: "/profile",
          active: location.pathname === "/profile",
        },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center justify-center p-2"
              >
                <div className="w-12 h-12 bg-[#23407a] rounded-full flex items-center justify-center mb-1 shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-[#23407a]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "mobile-nav-item flex-1",
                item.active && "text-[#23407a]"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  item.active ? "text-[#23407a]" : "text-gray-500"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  item.active ? "text-[#23407a]" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
