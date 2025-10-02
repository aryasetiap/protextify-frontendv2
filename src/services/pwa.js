// src/services/pwa.js
// filepath: src/services/pwa.js
/**
 * PWA Service untuk mengelola Progressive Web App features
 */

class PWAService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isSupported = "serviceWorker" in navigator;
    this.installPromptShown =
      localStorage.getItem("pwa-install-prompt-shown") === "true";
  }

  /**
   * Initialize PWA service
   */
  async init() {
    if (!this.isSupported) {
      console.log("Service workers are not supported");
      return;
    }

    try {
      // Register service worker
      await this.registerServiceWorker();

      // Setup install prompt
      this.setupInstallPrompt();

      // Check if already installed
      this.checkInstallStatus();

      // Setup app update detection
      this.setupUpdateDetection();

      console.log("PWA initialized successfully");
    } catch (error) {
      console.error("PWA initialization failed:", error);
    }
  }

  /**
   * Register service worker
   */
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service worker registered:", registration);

      // Update service worker when new version is available
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New version available
            this.showUpdatePrompt();
          }
        });
      });

      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      throw error;
    }
  }

  /**
   * Setup install prompt
   */
  setupInstallPrompt() {
    // Listen for install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent default mini-infobar
      e.preventDefault();

      // Store event for later use
      this.deferredPrompt = e;

      // Show custom install prompt
      if (!this.installPromptShown) {
        this.showInstallPrompt();
      }
    });

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      console.log("PWA installed successfully");
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.trackInstallEvent();
    });
  }

  /**
   * Show install prompt
   */
  showInstallPrompt() {
    const promptElement = document.getElementById("pwa-install-prompt");
    const acceptButton = document.getElementById("pwa-install-accept");
    const dismissButton = document.getElementById("pwa-install-dismiss");

    if (!promptElement) return;

    // Show prompt
    promptElement.style.display = "block";

    // Handle accept
    acceptButton.addEventListener("click", () => {
      this.installApp();
    });

    // Handle dismiss
    dismissButton.addEventListener("click", () => {
      this.dismissInstallPrompt();
    });

    // Auto hide after 10 seconds
    setTimeout(() => {
      if (promptElement.style.display !== "none") {
        this.dismissInstallPrompt();
      }
    }, 10000);
  }

  /**
   * Install app
   */
  async installApp() {
    if (!this.deferredPrompt) return;

    try {
      // Show install prompt
      this.deferredPrompt.prompt();

      // Wait for user choice
      const choiceResult = await this.deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted install prompt");
        this.trackInstallEvent("accepted");
      } else {
        console.log("User dismissed install prompt");
        this.trackInstallEvent("dismissed");
      }

      // Clear deferred prompt
      this.deferredPrompt = null;
      this.hideInstallPrompt();
    } catch (error) {
      console.error("Install prompt failed:", error);
    }
  }

  /**
   * Dismiss install prompt
   */
  dismissInstallPrompt() {
    this.hideInstallPrompt();
    localStorage.setItem("pwa-install-prompt-shown", "true");
    this.installPromptShown = true;
    this.trackInstallEvent("dismissed");
  }

  /**
   * Hide install prompt
   */
  hideInstallPrompt() {
    const promptElement = document.getElementById("pwa-install-prompt");
    if (promptElement) {
      promptElement.style.display = "none";
    }
  }

  /**
   * Check if app is installed
   */
  checkInstallStatus() {
    // Check if running in standalone mode
    this.isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (this.isInstalled) {
      console.log("App is running in installed mode");
      this.hideInstallPrompt();
    }
  }

  /**
   * Setup update detection
   */
  setupUpdateDetection() {
    // Check for updates every 30 minutes
    setInterval(() => {
      this.checkForUpdates();
    }, 30 * 60 * 1000);

    // Check for updates on focus
    window.addEventListener("focus", () => {
      this.checkForUpdates();
    });
  }

  /**
   * Check for updates
   */
  async checkForUpdates() {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    } catch (error) {
      console.error("Update check failed:", error);
    }
  }

  /**
   * Show update prompt
   */
  showUpdatePrompt() {
    // Create update notification
    const updateNotification = document.createElement("div");
    updateNotification.className =
      "fixed top-4 left-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-50";
    updateNotification.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Update Available</h3>
          <p class="text-sm opacity-90">Versi baru Protextify tersedia</p>
        </div>
        <div class="flex gap-2">
          <button id="update-dismiss" class="px-3 py-1 text-sm opacity-75 hover:opacity-100">
            Nanti
          </button>
          <button id="update-reload" class="px-4 py-2 bg-white text-blue-600 text-sm rounded hover:bg-gray-100">
            Update
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(updateNotification);

    // Handle update
    document.getElementById("update-reload").addEventListener("click", () => {
      window.location.reload();
    });

    // Handle dismiss
    document.getElementById("update-dismiss").addEventListener("click", () => {
      updateNotification.remove();
    });

    // Auto remove after 15 seconds
    setTimeout(() => {
      if (document.body.contains(updateNotification)) {
        updateNotification.remove();
      }
    }, 15000);
  }

  /**
   * Track install events for analytics
   */
  trackInstallEvent(action = "shown") {
    // Track with analytics service
    if (window.gtag) {
      window.gtag("event", "pwa_install_prompt", {
        event_category: "PWA",
        event_label: action,
        value: 1,
      });
    }

    // Track with custom analytics
    this.sendAnalytics("pwa_install_prompt", { action });
  }

  /**
   * Send analytics data
   */
  sendAnalytics(event, data) {
    // Implement your analytics tracking here
    console.log("PWA Analytics:", event, data);
  }

  /**
   * Get PWA status
   */
  getStatus() {
    return {
      isSupported: this.isSupported,
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      promptShown: this.installPromptShown,
    };
  }

  /**
   * Force show install prompt (for manual trigger)
   */
  showInstallPromptManually() {
    if (this.deferredPrompt) {
      this.installApp();
    } else if (!this.isInstalled) {
      // Show information about installing
      alert(
        'Untuk install Protextify, gunakan menu "Add to Home Screen" di browser Anda.'
      );
    }
  }
}

// Create singleton instance
const pwaService = new PWAService();

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    pwaService.init();
  });
} else {
  pwaService.init();
}

export default pwaService;
