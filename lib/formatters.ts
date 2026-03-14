import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date?: string | Date | null, pattern = "MMM d, yyyy") {
  if (!date) return "N/A";
  return format(new Date(date), pattern);
}

export function formatDateTime(date?: string | Date | null) {
  if (!date) return "N/A";
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelative(date?: string | Date | null) {
  if (!date) return "never";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
