#!/usr/bin/env node
/**
 * Number-first cover cards for articles (1600×900), in the Gurkha Splash colors.
 *
 * The numbers on a card are typed from the article's fact table, never generated,
 * so a card is safe to use where an AI image would risk a wrong figure.
 *
 *   npm run card -- production/<story>/cards.json
 *
 * The spec is a list of cards:
 *   [{ "out": "public/<slug>/cover.jpg", "kicker": "2026 MIDTERMS", "title": "Seven seats flipped",
 *      "tiles": [{ "value": "58.7–39.2", "label": "North Carolina · Cooper" }], "note": "Unofficial results…" }]
 * A .jpg out path is written as a compressed JPEG (ffmpeg); anything else as PNG.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { PALETTE } from './style.mjs'
import { FONT_FACES, screenshot } from './screenshot.mjs'

const W = 1600
const H = 900

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function cardHtml({ kicker, title, tiles = [], note }) {
  // Up to four tiles sit two to a row with big numbers; more sit in two rows of smaller ones
  const roomy = tiles.length <= 4
  const columns = roomy ? Math.min(2, tiles.length) : Math.ceil(tiles.length / 2)
  const valueSize = roomy ? 92 : columns >= 4 ? 58 : 72
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_FACES}
  html,body{margin:0;}
  .card{position:relative;width:${W}px;height:${H}px;overflow:hidden;box-sizing:border-box;padding:64px 80px;
    display:flex;flex-direction:column;gap:30px;color:${PALETTE.white};
    background:
      radial-gradient(circle at 100% 0%, rgba(200,160,72,0.38), transparent 38%),
      radial-gradient(circle at 0% 100%, rgba(143,106,34,0.45), transparent 42%),
      ${PALETTE.black};}
  .top{display:flex;justify-content:space-between;align-items:baseline;}
  .brand{font:900 30px/1 "FG Serif";letter-spacing:-0.3px;}
  .kicker{font:900 22px/1 "FG Sans";letter-spacing:6px;text-transform:uppercase;color:${PALETTE.gold};}
  h1{margin:0;font:900 ${roomy ? 72 : 68}px/1.04 "FG Serif";letter-spacing:-1px;max-width:1340px;text-wrap:balance;}
  .rule{height:4px;width:120px;background:${PALETTE.gold};border-radius:2px;}
  .tiles{display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:20px;margin-top:auto;}
  .tile{border:2px solid rgba(200,160,72,0.55);border-radius:18px;padding:${roomy ? '24px 28px' : '22px 24px'};background:rgba(248,248,248,0.04);}
  .value{font:900 ${valueSize}px/1 "FG Serif";color:${PALETTE.goldBright};letter-spacing:-1px;white-space:nowrap;}
  .label{margin-top:${roomy ? 16 : 12}px;font:900 ${roomy ? 24 : 21}px/1.25 "FG Sans";letter-spacing:0.3px;color:${PALETTE.white};}
  .note{font:900 16px/1.3 "FG Sans";letter-spacing:1.5px;text-transform:uppercase;color:rgba(248,248,248,0.55);}
</style></head><body><div class="card">
  <div class="top"><div class="brand">Financial <span style="color:${PALETTE.gold}">Gurkha</span></div><div class="kicker">${esc(kicker)}</div></div>
  <h1>${esc(title)}</h1>
  <div class="rule"></div>
  <div class="tiles">${tiles.map((t) => `<div class="tile"><div class="value">${esc(t.value)}</div><div class="label">${esc(t.label)}</div></div>`).join('')}</div>
  ${note ? `<div class="note">${esc(note)}</div>` : ''}
</div></body></html>`
}

const specPath = process.argv[2]
if (!specPath) {
  console.error('Usage: npm run card -- <cards.json>')
  process.exit(1)
}
for (const card of JSON.parse(fs.readFileSync(specPath, 'utf8'))) {
  const out = path.resolve(card.out)
  const png = out.endsWith('.jpg') ? out.replace(/\.jpg$/, '.render.png') : out
  screenshot(cardHtml(card), { width: W, height: H, out: png })
  if (png !== out) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-q:v', '3', out])
    fs.rmSync(png)
  }
  console.log(`Card written: ${path.relative(process.cwd(), out)}`)
}
