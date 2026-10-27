#!/usr/bin/env node
/**
 * Brand frame renderer for Financial Gurkha reels: the "Gurkha Splash" look.
 *
 * Every reel sits inside the same frame: near-black canvas, the logo's gold
 * splashed out toward the edges, a clean 3:4 window in the middle for the
 * footage, and the wordmark on top. The window is transparent, so the video
 * plays underneath the frame.
 *
 *   npm run frame                       # frame, seed 1 -> brand/video/frames/frame-1.png
 *   npm run frame -- --seed 2           # same style, different splash pattern
 *   npm run frame -- --endcard          # closing card -> brand/video/frames/endcard-1.png
 *
 * Options
 *   --seed     splash pattern (default 1). Keep one seed per series for a uniform look.
 *   --endcard  render the opaque closing card instead of the frame
 *   --out      output path
 *
 * Needs Chrome, Brave or Chromium. Set CHROME_PATH if it is not found automatically.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { FRAME, PALETTE } from './style.mjs'

const args = process.argv.slice(2)
const opt = (name, fallback = '') => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback
}
const seed = Number(opt('seed', '1'))
const endcard = args.includes('--endcard')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const fontsDir = path.join(root, 'brand/video/fonts')
const { width: W, height: H, window: win } = FRAME

// Deterministic randomness: the same seed always gives the same splashes
function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(seed * 7919)
const between = (min, max) => min + rand() * (max - min)
const pick = (list) => list[Math.floor(rand() * list.length)]

// Zones that stay clean so the wordmark and URL always read
const KEEP_CLEAR = [
  { x: 150, y: win.y - 150, w: W - 300, h: 120 },
  { x: 260, y: win.y + win.h + 12, w: W - 520, h: 60 }
]
const isClear = (x, y, pad = 0) =>
  !KEEP_CLEAR.some((z) => x > z.x - pad && x < z.x + z.w + pad && y > z.y - pad && y < z.y + z.h + pad)

// Splashes cluster around the window's perimeter and spray outward to the canvas edge
function perimeterPoint(spread) {
  const side = pick(['top', 'bottom', 'left', 'right', 'top', 'bottom'])
  const along = rand()
  const out = between(-spread * 0.25, spread)
  if (side === 'top') return [win.x + along * win.w, win.y - out]
  if (side === 'bottom') return [win.x + along * win.w, win.y + win.h + out]
  if (side === 'left') return [win.x - out, win.y + along * win.h]
  return [win.x + win.w + out, win.y + along * win.h]
}

const splatColors = [PALETTE.gold, PALETTE.gold, PALETTE.goldBright, PALETTE.goldBright, PALETTE.champagne]
const n = (v) => v.toFixed(1)

// One splat, thrown outward from behind the footage: an irregular core, tapered
// streaks shooting away from the window, and droplets past the streak tips
function splat(cx, cy, size, color) {
  const away = Math.atan2(cy - (win.y + win.h / 2), cx - (win.x + win.w / 2))
  const parts = []
  for (let i = 0; i < 4; i++) {
    const a = between(0, Math.PI * 2)
    const d = size * between(0, 0.35)
    parts.push(`<circle cx="${n(cx + Math.cos(a) * d)}" cy="${n(cy + Math.sin(a) * d)}" r="${n(size * between(0.45, 0.8))}"/>`)
  }
  const streaks = Math.round(between(5, 11))
  for (let i = 0; i < streaks; i++) {
    const a = away + between(-1.3, 1.3)
    const len = size * between(1.2, 3.6)
    const half = size * between(0.08, 0.2)
    const px = Math.cos(a + Math.PI / 2) * half
    const py = Math.sin(a + Math.PI / 2) * half
    const tx = cx + Math.cos(a) * len
    const ty = cy + Math.sin(a) * len
    parts.push(`<path d="M${n(cx + px)} ${n(cy + py)} Q${n((cx + tx) / 2)} ${n((cy + ty) / 2)} ${n(tx)} ${n(ty)} Q${n((cx + tx) / 2)} ${n((cy + ty) / 2)} ${n(cx - px)} ${n(cy - py)}Z"/>`)
    const drop = len * between(1.1, 1.45)
    parts.push(`<circle cx="${n(cx + Math.cos(a) * drop)}" cy="${n(cy + Math.sin(a) * drop)}" r="${n(half * between(0.8, 1.6))}"/>`)
  }
  return `<g fill="${color}" filter="url(#ink)">${parts.join('')}</g>`
}

function splashLayer() {
  // A gold glow pooled in the canvas corners, warming the black around the paint
  const blooms = [
    [0, 0],
    [W, 0],
    [0, H],
    [W, H],
    [W / 2, H + 60]
  ].map(
    ([x, y]) =>
      `<circle cx="${n(x + between(-60, 60))}" cy="${n(y + between(-60, 60))}" r="${between(240, 340).toFixed(0)}" fill="${pick([PALETTE.gold, PALETTE.goldBright])}" opacity="${between(0.3, 0.45).toFixed(2)}" filter="url(#bloom)"/>`
  )
  // Big splats bursting out to the canvas edge, some running off it
  const bursts = []
  for (let tries = 0; bursts.length < 9 && tries < 300; tries++) {
    const edge = pick(['top', 'bottom', 'bottom', 'left', 'right'])
    const x = edge === 'left' ? between(-20, 40) : edge === 'right' ? between(W - 40, W + 20) : between(-20, W + 20)
    const y =
      edge === 'top' ? between(-20, win.y - 160) : edge === 'bottom' ? between(win.y + win.h + 90, H + 20) : between(0, H)
    const size = between(48, 100)
    if (!isClear(x, y, size * 2.5)) continue
    bursts.push(splat(x, y, size, rand() < 0.2 ? PALETTE.white : pick(splatColors)))
  }
  const splats = [...bursts]
  for (let tries = 0; splats.length < bursts.length + 14 && tries < 300; tries++) {
    const [x, y] = perimeterPoint(190)
    const size = between(22, 54)
    if (!isClear(x, y, size * 2)) continue
    const color = rand() < 0.15 ? PALETTE.white : pick(splatColors)
    splats.push(splat(x, y, size, color))
  }
  // Fine spray: dense near the window, thinning out toward the canvas edge
  const spray = []
  for (let tries = 0; spray.length < 320 && tries < 2000; tries++) {
    const [x, y] = perimeterPoint(between(10, 320))
    if (!isClear(x, y, 8)) continue
    const color = rand() < 0.25 ? PALETTE.white : pick(splatColors)
    spray.push(
      `<circle cx="${n(x)}" cy="${n(y)}" r="${between(1, 5).toFixed(1)}" fill="${color}" opacity="${between(0.6, 1).toFixed(2)}"/>`
    )
  }
  return blooms.join('') + splats.join('') + spray.join('')
}

// A few splats that land over the window's edge, so the paint reads as bursting out from behind the footage
function edgeSplats() {
  const corners = [
    [win.x, win.y],
    [win.x + win.w, win.y],
    [win.x, win.y + win.h],
    [win.x + win.w, win.y + win.h]
  ]
  const chosen = corners.filter(() => rand() < 0.6).slice(0, 3)
  return chosen
    .map(([x, y]) => splat(x + between(-10, 10), y + between(-10, 10), between(10, 18), pick(splatColors)))
    .join('')
}

const fontFaces = `
  @font-face{font-family:"FG Serif";src:url("file://${fontsDir}/PlayfairDisplay.ttf");font-weight:400 900;}
  @font-face{font-family:"FG Sans";src:url("file://${fontsDir}/Inter-Black.otf");font-weight:900;}`

const defs = `<defs>
  <filter id="ink" x="-50%" y="-50%" width="200%" height="200%">
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="${seed}" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="bloom" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="70"/></filter>
  <mask id="hole">
    <rect width="${W}" height="${H}" fill="white"/>
    <rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="${win.radius}" fill="black"/>
  </mask>
</defs>`

const wordmark = (size, y) => `
  <div class="wordmark" style="top:${y}px;font-size:${size}px">
    <span style="color:${PALETTE.white}">Financial</span> <span style="color:${PALETTE.gold}">Gurkha</span>
  </div>`

const frameHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${fontFaces}
  html,body{margin:0;background:transparent;}
  .frame{position:relative;width:${W}px;height:${H}px;overflow:hidden;}
  svg{position:absolute;inset:0;}
  .wordmark{position:absolute;left:0;right:0;text-align:center;font-family:"FG Serif";font-weight:900;
    letter-spacing:-0.5px;line-height:1;text-shadow:0 3px 18px rgba(0,0,0,0.85);}
  .url{position:absolute;left:0;right:0;top:${win.y + win.h + 26}px;text-align:center;
    font:900 30px/1 "FG Sans";letter-spacing:4px;color:${PALETTE.white};text-transform:uppercase;
    text-shadow:0 2px 12px rgba(0,0,0,0.9);}
</style></head><body><div class="frame">
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
  <g mask="url(#hole)">
    <rect width="${W}" height="${H}" fill="${PALETTE.black}"/>
    ${splashLayer()}
  </g>
  <rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="${win.radius}" fill="none"
    stroke="${PALETTE.gold}" stroke-width="4"/>
  ${edgeSplats()}
</svg>
${wordmark(76, win.y - 112)}
<div class="url">financialgurkha.com</div>
</div></body></html>`

const endcardHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${fontFaces}
  html,body{margin:0;background:${PALETTE.black};}
  .frame{position:relative;width:${W}px;height:${H}px;overflow:hidden;}
  svg{position:absolute;inset:0;}
  .card{position:absolute;left:${win.x}px;top:${win.y}px;width:${win.w}px;height:${win.h}px;border-radius:${win.radius}px;
    background:${PALETTE.black};border:4px solid ${PALETTE.gold};box-sizing:border-box;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;text-align:center;}
  .stack{font-family:"FG Serif";font-weight:900;font-size:170px;line-height:0.95;letter-spacing:-2px;}
  .tag{font:900 34px/1.3 "FG Sans";letter-spacing:3px;text-transform:uppercase;color:${PALETTE.white};max-width:760px;text-wrap:balance;}
  .cta{margin-top:30px;padding:22px 40px;border-radius:999px;background:${PALETTE.gold};color:${PALETTE.black};
    font:900 38px/1 "FG Sans";letter-spacing:2px;text-transform:uppercase;}
</style></head><body><div class="frame">
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}
  <g mask="url(#hole)">${splashLayer()}</g>
</svg>
<div class="card">
  <div class="stack"><div style="color:${PALETTE.white}">Financial</div><div style="color:${PALETTE.gold}">Gurkha</div></div>
  <div class="tag">Financial Gurkha is for the winners.</div>
  <div class="cta">Full breakdown · link in bio</div>
</div>
</div></body></html>`

const out = path.resolve(opt('out', `brand/video/frames/${endcard ? 'endcard' : 'frame'}-${seed}.png`))
fs.mkdirSync(path.dirname(out), { recursive: true })
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fg-frame-')), 'frame.html')
fs.writeFileSync(tmp, endcard ? endcardHtml : frameHtml)

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
if (!browser) {
  console.error('No Chrome, Brave or Chromium found. Set CHROME_PATH to a Chromium-based browser.')
  process.exit(1)
}

execFileSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    // Chrome refuses to run as root (containers, CI) unless its sandbox is off
    ...(process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : []),
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--default-background-color=00000000', // transparent window in the frame
    '--force-device-scale-factor=1',
    '--virtual-time-budget=3000', // let the bundled fonts load before the screenshot
    `--window-size=${W},${H}`,
    `--screenshot=${out}`,
    `file://${tmp}`,
  ],
  { stdio: 'ignore' }
)
console.log(`${endcard ? 'End card' : 'Frame'} written: ${path.relative(process.cwd(), out)} (${W}×${H}, seed ${seed})`)
