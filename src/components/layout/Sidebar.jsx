import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  FileText,
  Users,
  Settings,
  PlusCircle,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { USER_ROLES } from "../../utils/constants";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    if (user?.role === USER_ROLES.INSTRUCTOR) {
      return [
        {
          label: "Dashboard",
          icon: Home,
          path: "/instructor/dashboard",
        },
        {
          label: "Kelola Kelas",
          icon: BookOpen,
          path: "/instructor/classes",
        },
        {
          label: "Buat Kelas",
          icon: PlusCircle,
          path: "/instructor/create-class",
        },
        {
          label: "Analytics",
          icon: TrendingUp,
          path: "/instructor/analytics",
          disabled: true,
        },
        {
          label: "Pengaturan",
          icon: Settings,
          path: "/instructor/settings",
          disabled: true,
        },
      ];
    } else {
      return [
        {
          label: "Dashboard",
          icon: Home,
          path: "/dashboard/overview",
        },
        {
          label: "Kelas Saya",
          icon: BookOpen,
          path: "/dashboard/classes",
        },
        {
          label: "Gabung Kelas",
          icon: PlusCircle,
          path: "/dashboard/join-class",
        },
        {
          label: "Tugas Saya",
          icon: FileText,
          path: "/dashboard/assignments",
        },
        {
          label: "Riwayat",
          icon: Clock,
          path: "/dashboard/submissions",
        },
        {
          label: "Pengaturan",
          icon: Settings,
          path: "/dashboard/settings",
          disabled: true,
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <img
                src="/src/assets/logo-protextify.png"
                alt="Protextify"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-bold text-[#23407a]">
                Protextify
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#23407a] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            const isDisabled = item.disabled;

            return (
              <li key={index}>
                {isDisabled ? (
                  <div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-not-allowed opacity-50 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5 text-gray-400" />
                    {!isCollapsed && (
                      <span className="ml-3 text-gray-400">{item.label}</span>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isCollapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-[#23407a] text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#23407a]"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-white" : ""}`}
                    />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Version Info */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-gray-500 text-center">
            <p>Protextify v2.1.0</p>
            <p>Phase 3.1 - Routing System</p>
          </div>
        </div>
      )}
    </div>
  );
}
