import { ERROR_MESSAGE_MAP, TEXT } from "@/shared/constants";

/** Check if a string is a valid URL */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/** Check if a value is neither null nor undefined */
export const isExists = (value: unknown): boolean => {
  return value !== undefined && value !== null;
};

/** Safely access a nested property by dot-path */
export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string,
  defaultValue: unknown = "",
): unknown => {
  return (
    path.split(".").reduce<unknown>((acc, key) => {
      if (
        acc &&
        typeof acc === "object" &&
        key in (acc as Record<string, unknown>)
      ) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj) ?? defaultValue
  );
};

/** Extract a user-friendly error message from an API error response */
export const getErrorMessage = (
  err: { code?: string; message?: string } | null,
): string => {
  return (
    (err?.code && ERROR_MESSAGE_MAP[err.code]) ||
    err?.message ||
    TEXT.REQUEST_FAILED
  );
};

/** Compare a current pathname with a route path template (e.g. /account/:id) */
export const comparePath = (pathname: string, pagePath: string): boolean => {
  if (pagePath === pathname) return true;
  if (pagePath.includes(":")) {
    const base = pagePath.split("/:")[0];
    return pathname.startsWith(base);
  }
  return false;
};
