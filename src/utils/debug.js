// src/utils/debug.js
export const debugAssignment = (assignmentData) => {
  if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
    console.log("📝 Assignment Data:", assignmentData);
    console.log("💰 Payment Required:", assignmentData.paymentRequired);
    console.log("💵 Total Price:", assignmentData.totalPrice);
  }
};
