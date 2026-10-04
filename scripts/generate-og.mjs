#!/usr/bin/env node
// Renders scripts/og-template.html to public/og-image.png (1200×630) with
// headless Chrome. The card is laid out in HTML/CSS so it can reuse the site's
// real fonts and palette; Chrome rasterizes it crisply without an image lib.
// Re-run this after editing scripts/og-template.html: `npm run og`.
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const template = resolve(root, 'scripts/og-template.html')
const out = resolve(root, 'public/og-image.png')

const candidates = [
  process.env.CHROME_BIN,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

const chrome = candidates.find((bin) => {
  if (bin.includes('/')) return existsSync(bin)
  try {
    execFileSync('which', [bin], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
})

if (!chrome) {
  console.error('og: no Chrome/Chromium found — set CHROME_BIN to render public/og-image.png')
  process.exit(1)
}

rmSync(out, { force: true })
execFileSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    // The card references the logo SVG by file:// path.
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    `--screenshot=${out}`,
    `file://${template}`,
  ],
  { stdio: 'inherit' },
)

console.log(`og: wrote ${out}`)
