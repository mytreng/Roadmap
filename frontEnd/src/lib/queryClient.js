import { QueryClient } from "@tanstack/react-query";
import { parseApiError } from "../api/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30s: navigating back to a page shows the
      // cached data instantly instead of showing a skeleton again.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Only retry failures that can plausibly succeed (network, 5xx, 429).
      retry: (failureCount, error) =>
        failureCount < 2 && parseApiError(error).retryable,
    },
    mutations: {
      retry: false,
    },
  },
});
