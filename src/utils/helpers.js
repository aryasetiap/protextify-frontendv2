import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function untuk menggabungkan class names dengan Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("id-ID", defaultOptions).format(
    new Date(date)
  );
}

/**
 * Format mata uang Indonesia
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

/**
 * Truncate text dengan ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generate random string untuk token
 */
export function generateRandomString(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep function untuk delay
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole, requiredRole) {
  return userRole === requiredRole;
}

/**
 * Get initials from full name
 */
export function getInitials(fullName) {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
