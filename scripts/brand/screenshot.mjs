/**
 * Render an HTML string to a PNG with headless Chrome, Brave or Chromium.
 * Shared by the brand renderers (frames, end cards, cover cards).
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/** Bundled fonts, for @font-face rules in the rendered HTML. */
export const FONTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../brand/video/fonts')
export const FONT_FACES = `
  @font-face{font-family:"FG Serif";src:url("file://${FONTS_DIR}/PlayfairDisplay.ttf");font-weight:400 900;}
  @font-face{font-family:"FG Sans";src:url("file://${FONTS_DIR}/Inter-Black.otf");font-weight:900;}`

export function screenshot(html, { width, height, out, transparent = false }) {
  const browser =
    process.env.CHROME_PATH ||
    [
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    ].find((p) => fs.existsSync(p))
  if (!browser) throw new Error('No Chrome, Brave or Chromium found. Set CHROME_PATH to a Chromium-based browser.')

  fs.mkdirSync(path.dirname(out), { recursive: true })
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fg-render-')), 'page.html')
  fs.writeFileSync(tmp, html)
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      // Chrome refuses to run as root (containers, CI) unless its sandbox is off
      ...(process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : []),
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      ...(transparent ? ['--default-background-color=00000000'] : []),
      '--force-device-scale-factor=1',
      '--virtual-time-budget=3000', // let the bundled fonts load before the screenshot
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      `file://${tmp}`,
    ],
    { stdio: 'ignore' }
  )
  return out
}
