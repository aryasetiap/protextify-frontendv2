import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen">
      {/* Outlet akan menampilkan komponen auth pages */}
      <Outlet />
    </div>
  );
}
