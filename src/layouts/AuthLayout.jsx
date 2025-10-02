import { Outlet } from "react-router-dom";
import { Container } from "../components";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-transparent pointer-events-none" />

      <Container className="relative z-10 py-12">
        <Outlet />
      </Container>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 text-center py-4">
        <p className="text-xs text-gray-500">
          © 2025 Protextify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
