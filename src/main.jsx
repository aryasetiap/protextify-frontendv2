import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { handleVirtualKeyboard } from "./utils/touch";
import "./index.css";

// Handle virtual keyboard on mobile
handleVirtualKeyboard();

// Prevent zooming on iOS double-tap
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

// Set initial viewport height for CSS
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setVH();
window.addEventListener("resize", setVH);
window.addEventListener("orientationchange", () => {
  setTimeout(setVH, 100);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "14px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
