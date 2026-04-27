/** HTTP methods supported by the API */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/** Authentication strategies for API requests */
export type AuthType = "none" | "bearer" | "basic";

/** Toast notification severity levels (maps to MUI Alert severity) */
export type ToastType = "success" | "error" | "warning" | "info";

/** Options for making an API request via httpClient */
export interface FetchOptions {
  apiUrl: string;
  endpoint: string;
  method: HttpMethod;
  payload?: Record<string, unknown> | FormData;
  authType: AuthType;
  headers?: Record<string, string>;
}

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
  result: boolean;
  data?: T;
  message?: string;
  code?: string;
}

/** Paginated data from list endpoints */
export interface PaginatedData<T> {
  content: T[];
  totalPages: number;
  totalElements?: number;
}

/** OAuth token response from /api/token */
export interface TokenResponse {
  access_token?: string;
  token_type?: string;
}

/** Verify credential response */
export interface VerifyCredentialResponse {
  qrCodeUrl?: string;
}

/** Request key response */
export interface RequestKeyResponse {
  secretKey?: string;
}

/** Forgot password response */
export interface ForgotPasswordResponse {
  userId: string;
}
