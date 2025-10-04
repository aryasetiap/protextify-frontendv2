import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import DashboardHeader from "../components/layout/DashboardHeader";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { cn } from "../utils/helpers";

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    // Simpan data user
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

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
            {/* Enhanced Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Enhanced Sidebar */}
            <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-2xl transform transition-transform rounded-r-3xl overflow-hidden">
              {/* Enhanced Mobile Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] p-6">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="/src/assets/logo-protextify-putih.png"
                      alt="Protextify"
                      className="h-8 w-auto"
                    />
                    <span className="ml-3 text-xl font-bold text-white">
                      Dashboard
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white border border-white/20"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
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
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-3 rounded-2xl hover:bg-[#23407a]/10 transition-all duration-300 text-gray-700 hover:text-[#23407a] border border-gray-200/50 hover:border-[#23407a]/30"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center">
                <img
                  src="/src/assets/logo-protextify-warna.png"
                  alt="Protextify"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-[#23407a]">
                  Protextify
                </span>
              </div>

              {/* User avatar untuk mobile */}
              <div className="w-10 h-10 bg-gradient-to-br from-[#23407a] to-[#3b5fa4] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
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
