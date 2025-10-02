import React from "react";
import { Alert } from "./ui";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error untuk monitoring
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="error" title="Terjadi Kesalahan">
              <p className="mb-4">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh
                halaman atau hubungi administrator.
              </p>

              {import.meta.env.DEV && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Detail Error (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="mt-4 space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#23407a] text-white px-4 py-2 rounded hover:bg-[#1a2f5c] transition-colors"
                >
                  Refresh Halaman
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Kembali
                </button>
              </div>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
