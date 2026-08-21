import { QueryClient } from '@tanstack/react-query'

// Site data is small (a handful of tables) — keep it fresh so admin saves
// appear immediately on every route load and tab refocus.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})
