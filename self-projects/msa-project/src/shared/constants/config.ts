import type { ToastType } from "@/shared/types/api.types";

/** Input length limits */
export const TINY_TEXT_MAX_LENGTH = 100;
export const TEXT_MAX_LENGTH = 1000;

/** Pagination defaults */
export const ITEMS_PER_PAGE = 21;

/** Debounce interval for autocomplete fetches (ms) */
export const FETCH_INTERVAL = 300;

/** Session key auto-expire timeout (30 minutes) */
export const SESSION_KEY_TIMEOUT = 30 * 60 * 1000;

/** WebSocket ping interval (50 seconds) */
export const PING_INTERVAL = 50_000;

/** Default color for new tags */
export const DEFAULT_COLOR = "#FFFFFF";

/** z-index layers */
export const Z_INDEXES = {
  UNAUTHORIZED_DIALOG: 1000,
  DEFAULT_MODAL: 50,
  TOOLBAR: 10,
} as const;

/** Toast severity shortcuts (typed) */
export const TOAST: Record<string, ToastType> = {
  SUCCESS: "success",
  ERROR: "error",
  WARN: "warning",
  INFO: "info",
} as const;

/** Holiday icon map keyed by 'MM-DD' */
export const HOLIDAY_ICONS: Record<string, string> = {
  "01-01": "🎉​",
  "02-14": "💖",
  "03-08": "🌹",
  "06-01": "🎈",
  "10-31": "🎃",
  "12-24": "🎄",
  "12-25": "🎁",
};
