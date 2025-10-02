import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { router } from "./index";
import { LoadingSpinner, Container } from "../components";

// Loading fallback component
const RouterLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Container className="py-12">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Memuat halaman...</p>
      </div>
    </Container>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<RouterLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
