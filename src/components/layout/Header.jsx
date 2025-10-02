import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Bell, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll for mobile header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const getDefaultRoute = (role) => {
    return role === "INSTRUCTOR" ? "/instructor/dashboard" : "/dashboard";
  };

  return (
    <>
      <header
        className={cn(
          "bg-white border-b border-gray-200 transition-all duration-200 relative z-40",
          scrolled && "shadow-sm backdrop-blur-sm bg-white/95"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/src/assets/logo-protextify.png"
                  alt="Protextify"
                  className="h-8 md:h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-[#23407a] px-3 py-2 text-sm font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-[#23407a] px-3 py-2 text-sm font-medium transition-colors"
              >
                Tentang
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#23407a] transition-all"
                  >
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                      <div className="h-8 w-8 rounded-full bg-[#23407a] text-white flex items-center justify-center text-sm font-medium">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {user?.fullName}
                      </span>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border">
                        <Link
                          to={getDefaultRoute(user?.role)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 inline mr-3" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 inline mr-3" />
                          Profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="h-4 w-4 inline mr-3" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/auth/login">
                    <Button variant="ghost">Masuk</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button>Daftar</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search Button */}
              <button className="p-2 rounded-lg text-gray-700 hover:text-[#23407a] hover:bg-gray-100 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile Notifications */}
              {isAuthenticated && (
                <button className="p-2 rounded-lg text-gray-700 hover:text-[#23407a] hover:bg-gray-100 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-[#23407a] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#23407a] transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-sm bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-4 overflow-y-auto">
                <nav className="space-y-1 px-4">
                  <Link
                    to="/"
                    className="mobile-list-item rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">Beranda</span>
                  </Link>
                  <Link
                    to="/about"
                    className="mobile-list-item rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">Tentang</span>
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <div className="border-t border-gray-200 my-4"></div>
                      <Link
                        to={getDefaultRoute(user?.role)}
                        className="mobile-list-item rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        to="/profile"
                        className="mobile-list-item rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          Profil
                        </span>
                      </Link>
                    </>
                  ) : null}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 safe-area-bottom">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#23407a] text-white flex items-center justify-center font-medium">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Masuk
                      </Button>
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">Daftar</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
