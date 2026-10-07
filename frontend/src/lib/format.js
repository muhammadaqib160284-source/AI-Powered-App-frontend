import { format, isValid, parseISO } from "date-fns";

export function formatDate(value, pattern = "MMM d, yyyy") {
  if (!value) return null;
  const d = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(d) ? format(d, pattern) : null;
}

export const humanize = (v) =>
  v ? String(v).replace(/[_-]+/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : "";

export const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";

export const formatBytes = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
