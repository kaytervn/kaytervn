import { HOLIDAY_ICONS } from "@/shared/constants/config";

/** Format a Date to Java-style UTC string: "Mon Jan 01 00:00:00 UTC 2024" */
export const formatJavaDate = (date = new Date()): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const dayOfMonth = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day} ${month} ${dayOfMonth} ${hours}:${minutes}:${seconds} UTC ${year}`;
};

/** Generate a random alphanumeric string of given length */
export const generateRandomString = (length: number): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/** Current timestamp as a string */
export const generateTimestamp = (): string => {
  return Date.now().toString();
};

/** Strip ROLE_ prefix from authority strings */
export const getRoles = (authorities: string[]): string[] => {
  return authorities.map((role) => role.replace(/^ROLE_/, ""));
};

/** Get holiday icon for today's date (Vietnam timezone), if applicable */
export function getHolidayIcon(): string | undefined {
  const now = new Date();
  const vnDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const dateKey = vnDate.replace("/", "-");
  return HOLIDAY_ICONS[dateKey];
}

/** Get 1-2 character initials from a name, or a holiday icon if applicable */
export function getAvatarInitials(fullName?: string): string {
  const holidayIcon = getHolidayIcon();
  if (holidayIcon) return holidayIcon;
  if (!fullName) return "👤";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Normalize Vietnamese text for comparison (strip diacritics, lowercase) */
export const normalizeVietnamese = (str: string): string => {
  if (!str || typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();
};
