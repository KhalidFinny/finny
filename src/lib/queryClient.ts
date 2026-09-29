import { QueryClient } from '@tanstack/react-query'

// Cache policy (single source of truth — per-query overrides live in queries.ts):
// - staleTime: 1min default — data is fresh enough that page switches never refetch,
//   but a manual reload picks up changes quickly.
// - gcTime: 10min — switched-away pages keep their data in memory, so navigating
//   back is instant without re-fetching.
// - refetchOnWindowFocus: off — avoids surprise refetches; admin saves explicitly
//   invalidate ['site'].
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
