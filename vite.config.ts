// NOTE: reconstructed 2026-08-08 after accidental deletion (original was
// never committed). Standard TanStack Start + Cloudflare plugin wiring;
// the @cloudflare/vite-plugin is required for the cloudflare:workers
// module to resolve in the Workers runtime.
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    cloudflare(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    // wrangler (via the dev platform proxy) is a Node CLI — prebundling it
    // trips over broken ESM entries (blake3-wasm). It's only imported
    // server-side, so it never needs client optimization.
    exclude: ['wrangler', 'blake3-wasm'],
  },
})
