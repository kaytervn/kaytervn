import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance.
 *
 * - staleTime: 30s — avoid redundant refetches for data that hasn't changed
 * - retry: 1 — single retry on network failures
 * - refetchOnWindowFocus: false — prevent jarring refetches when user tabs back
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
