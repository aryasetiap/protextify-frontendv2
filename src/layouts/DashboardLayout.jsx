import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import DashboardHeader from "../components/layout/DashboardHeader";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { cn } from "../utils/helpers";

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-xl transform transition-transform">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <img
                    src="/src/assets/logo-protextify.png"
                    alt="Protextify"
                    className="h-8 w-auto"
                  />
                  <span className="ml-2 text-lg font-bold text-[#23407a]">
                    Dashboard
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
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
              <div className="w-10"></div> {/* Spacer for balance */}
            </div>
          </div>

          {/* Desktop Header - Hanya DashboardHeader */}
          <div className="hidden lg:block">
            <DashboardHeader />
          </div>

          {/* Main Content Area */}
          <main className={cn("flex-1 overflow-y-auto", "pb-20 md:pb-0")}>
            <div className="safe-area-bottom">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
