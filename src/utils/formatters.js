/**
 * Format file size ke human readable
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration (milliseconds) ke human readable
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}j ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
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
 * Format relative time (timeago)
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);

  const intervals = [
    { label: "tahun", seconds: 31536000 },
    { label: "bulan", seconds: 2592000 },
    { label: "minggu", seconds: 604800 },
    { label: "hari", seconds: 86400 },
    { label: "jam", seconds: 3600 },
    { label: "menit", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label} yang lalu`;
    }
  }

  return "Baru saja";
}

/**
 * Format number dengan separator
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}
