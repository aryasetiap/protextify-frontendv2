import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import { cn, formatDate } from "@/utils";
import { BRAND_COLORS, COLOR_PALETTE } from "@/utils/constants";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={viteLogo} className="h-12 w-12" alt="Vite logo" />
              <div>
                <h1 className="heading-3 text-brand">
                  Protextify Design System
                </h1>
                <p className="body-small text-muted">Testing implementation</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="badge badge-primary">Phase 1.2</span>
              <span className="badge badge-success">Complete</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container content-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Typography Showcase */}
          <div className="card">
            <div className="card-header">
              <h2 className="heading-4">Typography Scale</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <h1 className="heading-1">Heading 1</h1>
                <h2 className="heading-2">Heading 2</h2>
                <h3 className="heading-3">Heading 3</h3>
                <h4 className="heading-4">Heading 4</h4>
              </div>
              <div className="space-y-2">
                <p className="body-lead">Lead text - Introduction paragraph</p>
                <p className="body-regular">Regular body text for content</p>
                <p className="body-small">
                  Small text for secondary information
                </p>
                <p className="caption">CAPTION TEXT</p>
              </div>
            </div>
          </div>

          {/* Button Showcase */}
          <div className="card">
            <div className="card-header">
              <h2 className="heading-4">Button Components</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-primary btn-sm">Primary SM</button>
                  <button className="btn btn-primary btn-md">Primary MD</button>
                  <button className="btn btn-primary btn-lg">Primary LG</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-secondary btn-md">
                    Secondary
                  </button>
                  <button className="btn btn-outline btn-md">Outline</button>
                  <button className="btn btn-ghost btn-md">Ghost</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-success btn-md">Success</button>
                  <button className="btn btn-danger btn-md">Danger</button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="card">
            <div className="card-header">
              <h2 className="heading-4">Brand Colors</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div
                    className="h-16 w-full rounded-lg mb-2"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
                  ></div>
                  <p className="body-small">Primary</p>
                  <p className="caption">{BRAND_COLORS.primary}</p>
                </div>
                <div className="text-center">
                  <div
                    className="h-16 w-full rounded-lg mb-2"
                    style={{ backgroundColor: BRAND_COLORS.primaryDark }}
                  ></div>
                  <p className="body-small">Primary Dark</p>
                  <p className="caption">{BRAND_COLORS.primaryDark}</p>
                </div>
                <div className="text-center">
                  <div
                    className="h-16 w-full rounded-lg mb-2"
                    style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                  ></div>
                  <p className="body-small">Primary Light</p>
                  <p className="caption">{BRAND_COLORS.primaryLight}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Forms & Inputs */}
          <div className="card">
            <div className="card-header">
              <h2 className="heading-4">Form Components</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block body-small font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block body-small font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="input-field h-20 resize-none"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button className="btn btn-primary">Submit</button>
                <button className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>

          {/* Alerts & Badges */}
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h2 className="heading-4">Alerts & Status</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="alert alert-success">
                    ✅ Success: Operation completed successfully
                  </div>
                  <div className="alert alert-warning">
                    ⚠️ Warning: Please check your input
                  </div>
                  <div className="alert alert-error">
                    ❌ Error: Something went wrong
                  </div>
                  <div className="alert alert-info">
                    ℹ️ Info: Additional information available
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-primary">Primary</span>
                    <span className="badge badge-secondary">Secondary</span>
                    <span className="badge badge-success">Success</span>
                    <span className="badge badge-warning">Warning</span>
                    <span className="badge badge-error">Error</span>
                    <span className="badge badge-info">Info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Counter */}
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h2 className="heading-4">Interactive Demo</h2>
            </div>
            <div className="card-body">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={viteLogo}
                    className="h-16 w-16 animate-bounce-gentle"
                    alt="Vite"
                  />
                  <div className="text-4xl">+</div>
                  <img
                    src={reactLogo}
                    className="h-16 w-16 animate-spin-slow"
                    alt="React"
                  />
                </div>
                <h3 className="heading-3 text-gradient-brand">
                  Vite + React + Protextify
                </h3>
                <div className="space-y-3">
                  <p className="body-regular">
                    Count is{" "}
                    <span className="font-semibold text-brand">{count}</span>
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => setCount(count + 1)}
                    >
                      Increment
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCount(0)}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <p className="body-small text-muted">
                    API Base URL:{" "}
                    <code className="code-inline">
                      {import.meta.env.VITE_API_URL ||
                        "http://localhost:3000/api"}
                    </code>
                  </p>
                  <p className="body-small text-muted">
                    Today:{" "}
                    <span className="font-medium">
                      {formatDate(new Date())}
                    </span>
                  </p>
                  <p className="body-small text-muted">
                    Design System:{" "}
                    <span className="badge badge-success">Ready</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container py-8">
          <div className="text-center space-y-2">
            <p className="body-small text-muted">
              Protextify Design System v1.2 • Phase 1 Complete
            </p>
            <p className="caption">
              Built with React {import.meta.env.REACT_VERSION || "19.1.1"} +
              Vite + TailwindCSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
