/**
 * Convert a timestamp string into "time ago" format.
 * Example: "3 minutes ago", "2 hours ago", "Yesterday"
 */
export function formatTimeAgo(dateInput: string | number | Date): string {
  const now = new Date();
  const date = new Date(dateInput);

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return formatDate(dateInput);
}

/**
 * Format date as: Jan 20, 2025
 */
export function formatDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date + time as: Jan 20, 2025 • 4:32 PM
 */
export function formatDateTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " • " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
}

/**
 * Truncate long strings with ellipsis
 * Example: "This is a long message" → "This is a long..."
 */
export function truncateText(text: string, max = 40): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

/**
 * Capitalize first letter of a word
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format large numbers with commas
 * Example: 12000 → "12,000"
 */
export function numberWithCommas(value: number | string): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
