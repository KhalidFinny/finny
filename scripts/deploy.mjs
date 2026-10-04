#!/usr/bin/env node
// Clean deploy pipeline for TanStack Start + Cloudflare Workers.
// Two-pass build: first pass generates dist/server/server.js (no main in config),
// second pass sees it and generates dist/finny/ (the worker bundle with assets).
// Then strip invalid named exports and deploy.
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const WRANGLER = 'wrangler.jsonc'
const MAIN = '"main": "./dist/server/server.js"'

// 1. Remove main from wrangler.jsonc so the first build doesn't error.
//    Matches the whole line (indent + optional trailing comma) so repeated
//    deploys can't accumulate duplicate "main" entries.
let cfg = readFileSync(WRANGLER, 'utf8')
cfg = cfg.replace(/^[ \t]*"main"\s*:\s*"[^"]*"\s*,?[ \t]*\r?\n/gm, '')
writeFileSync(WRANGLER, cfg)

// 2. First build — generates dist/server/server.js
console.log('building (pass 1: server)...')
execSync('npm run build', { stdio: 'inherit' })

// 3. Restore main so the second build generates dist/finny/ (the worker),
//    but only if it isn't already present.
cfg = readFileSync(WRANGLER, 'utf8')
if (!/^[ \t]*"main"\s*:/m.test(cfg)) {
  cfg = cfg.replace('"name": "finny",', `"name": "finny",\n  ${MAIN},`)
}
writeFileSync(WRANGLER, cfg)

// 4. Second build — generates dist/finny/ (the worker + its config)
console.log('building (pass 2: worker)...')
execSync('npm run build', { stdio: 'inherit' })

// 5. Strip invalid named exports from the worker entry
console.log('stripping worker exports...')
execSync('node scripts/strip-worker-exports.mjs', { stdio: 'inherit' })

// 6. Deploy
console.log('deploying...')
execSync('npx wrangler deploy --config dist/finny/wrangler.json', { stdio: 'inherit' })
