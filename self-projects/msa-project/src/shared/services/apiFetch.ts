import { httpClient } from "@/shared/services/httpClient";
import type { ApiResponse, FetchOptions } from "@/shared/types/api.types";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useSessionStore } from "@/shared/stores/useSessionStore";

/**
 * Pre-wired fetch function for use with TanStack Query.
 *
 * Automatically hooks into Zustand stores for:
 * - 401 handling → sets isUnauthorized
 * - Session refresh → restarts session timeout
 *
 * @example
 * // In a query:
 * useQuery({
 *   queryKey: ['platforms'],
 *   queryFn: () => apiFetch({
 *     apiUrl: ENV.API_URL,
 *     endpoint: '/v1/platform/list',
 *     method: 'GET',
 *     authType: 'bearer',
 *   }),
 * });
 */
export async function apiFetch<T = unknown>(
  options: FetchOptions,
): Promise<ApiResponse<T>> {
  return httpClient(
    options,
    () => useAuthStore.getState().setIsUnauthorized(true),
    () => useSessionStore.getState().refreshSessionTimeout(),
  ) as Promise<ApiResponse<T>>;
}
