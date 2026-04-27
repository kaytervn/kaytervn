/** Typed environment variables from .env (accessed via import.meta.env) */
export interface AppEnv {
  readonly CLIENT_SECRET: string;
  readonly CLIENT_ID: string;
  readonly API_KEY: string;
  readonly API_URL: string;
  readonly CLIENT_KEY: string;
  readonly SOCKET_URL: string;
}

/**
 * Reads all required environment variables with type safety.
 * Falls back to empty string if not set (avoids runtime undefined access).
 */
export const getEnv = (): AppEnv => ({
  CLIENT_SECRET: import.meta.env.VITE_CLIENT_SECRET ?? "",
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID ?? "",
  API_KEY: import.meta.env.VITE_API_KEY ?? "",
  API_URL: import.meta.env.VITE_API_URL ?? "",
  CLIENT_KEY: import.meta.env.VITE_CLIENT_KEY ?? "",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL ?? "",
});

/** Singleton env instance */
export const ENV = getEnv();
