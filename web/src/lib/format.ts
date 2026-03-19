import { format } from "date-fns";

export function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
}

export function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}
