// Strips invalid named exports from the generated Cloudflare worker entry.
// The @cloudflare/vite-plugin wrapper re-exports the TanStack server module's
// named exports, including `TSS_SERVER_FUNCTION` (a Symbol.for(...)) — workerd
// rejects it at startup ("Incorrect type for map entry 'n'"). The named
// exports are dead weight: the client bundle is a separate static asset and
// the worker only needs the default fetch handler.
import { readFileSync, writeFileSync } from 'node:fs'

const path = new URL('../dist/finny/index.js', import.meta.url)
const original = readFileSync(path, 'utf8')
const stripped = original.replace(
  /export \{ createServerEntry, worker_entry_default as default, TSS_SERVER_FUNCTION as n, getServerFnById as r, createServerFn as t \}/,
  'export { worker_entry_default as default }',
)
if (stripped !== original) {
  writeFileSync(path, stripped)
  console.log('stripped worker named exports')
} else {
  console.log('worker exports already clean')
}
