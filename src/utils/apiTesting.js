// src/utils/apiTesting.js
import {
  authService,
  classesService,
  assignmentsService,
  submissionsService,
  plagiarismService,
  paymentsService,
} from "../services";

export const testApiServices = async () => {
  if (import.meta.env.DEV) {
    console.group("🧪 API Services Test Suite");

    try {
      // Test service imports
      console.log("✅ Auth Service:", authService);
      console.log("✅ Classes Service:", classesService);
      console.log("✅ Assignments Service:", assignmentsService);
      console.log("✅ Submissions Service:", submissionsService);
      console.log("✅ Plagiarism Service:", plagiarismService);
      console.log("✅ Payments Service:", paymentsService);

      // Test API endpoints availability
      console.group("🌐 API Endpoints Test");

      try {
        // Test ping to backend health endpoint
        const baseUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const healthUrl = baseUrl.replace("/api", "") + "/health"; // Remove /api and add /health

        const response = await fetch(healthUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Backend health check: OK", data);
        } else {
          console.warn(
            "⚠️ Backend health check: Failed (status:",
            response.status,
            ")"
          );
        }
      } catch (error) {
        console.warn("⚠️ Backend connection: Failed (", error.message, ")");
        console.log(
          "💡 Make sure backend is running. Trying health endpoint at:",
          (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(
            "/api",
            ""
          ) + "/health"
        );
      }

      console.groupEnd();

      // Test service methods exist
      console.group("🔧 Service Methods Test");

      const serviceTests = [
        {
          name: "Auth Service",
          service: authService,
          methods: ["login", "register", "getCurrentUser"],
        },
        {
          name: "Classes Service",
          service: classesService,
          methods: ["getClasses", "createClass", "joinClass"],
        },
        {
          name: "Assignments Service",
          service: assignmentsService,
          methods: ["createAssignment", "getAssignments"],
        },
        {
          name: "Submissions Service",
          service: submissionsService,
          methods: ["createSubmission", "getHistory"],
        },
        {
          name: "Plagiarism Service",
          service: plagiarismService,
          methods: ["checkPlagiarism", "getPlagiarismReport"],
        },
        {
          name: "Payments Service",
          service: paymentsService,
          methods: ["createTransaction", "getTransactionHistory"],
        },
      ];

      serviceTests.forEach(({ name, service, methods }) => {
        const missingMethods = methods.filter(
          (method) => typeof service[method] !== "function"
        );
        if (missingMethods.length === 0) {
          console.log(`✅ ${name}: All methods available`);
        } else {
          console.warn(`⚠️ ${name}: Missing methods:`, missingMethods);
        }
      });

      console.groupEnd();

      // Test environment variables
      console.group("⚙️ Environment Configuration Test");

      const requiredEnvVars = ["VITE_API_URL", "VITE_WS_URL"];

      requiredEnvVars.forEach((envVar) => {
        const value = import.meta.env[envVar];
        if (value) {
          console.log(`✅ ${envVar}:`, value);
        } else {
          console.warn(`⚠️ ${envVar}: Not set (using default)`);
        }
      });

      console.groupEnd();

      console.log("🎉 API Services test suite completed!");
    } catch (error) {
      console.error("❌ API services test failed:", error);
    }

    console.groupEnd();
  }
};

// Export individual test functions for specific testing
export const testBackendConnection = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const healthUrl = baseUrl.replace("/api", "") + "/health";

    const response = await fetch(healthUrl);
    return response.ok;
  } catch {
    return false;
  }
};

export const testServiceMethods = (serviceName, service, expectedMethods) => {
  const missingMethods = expectedMethods.filter(
    (method) => typeof service[method] !== "function"
  );
  return {
    serviceName,
    isValid: missingMethods.length === 0,
    missingMethods,
  };
};
