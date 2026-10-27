/**
 * Word-by-word captions as an ASS subtitle file, burned in by ffmpeg (libass).
 *
 * Words show in short bursts of up to three; the word being spoken turns gold
 * and pops slightly larger. Timing comes from Fish Audio's word timestamps.
 */
import { FRAME, PALETTE } from '../brand/style.mjs'

const MAX_WORDS = 3
const MAX_CHARS = 18 // keep each burst on one line

// ASS colors are &HBBGGRR&
const assColor = (hex) => `&H${hex.slice(5, 7)}${hex.slice(3, 5)}${hex.slice(1, 3)}&`

const time = (t) => {
  const cs = Math.max(0, Math.round(t * 100))
  const h = Math.floor(cs / 360000)
  const m = Math.floor((cs % 360000) / 6000)
  const s = Math.floor((cs % 6000) / 100)
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`
}

// Drop delivery cues like [excited] and stray punctuation; keep $, %, decimals and apostrophes
export const cleanWord = (text) =>
  text
    .replace(/\[[^\]]*\]/g, '')
    .replace(/^[^\w$€£¥]+|[^\w%]+$/g, '')
    .toUpperCase()

function groupWords(words) {
  const groups = []
  let current = []
  for (const word of words) {
    const chars = current.reduce((sum, w) => sum + w.text.length + 1, 0) + word.text.length
    if (current.length && (current.length >= MAX_WORDS || chars > MAX_CHARS)) {
      groups.push(current)
      current = []
    }
    current.push(word)
  }
  if (current.length) groups.push(current)
  return groups
}

export function buildAss(rawWords) {
  const words = rawWords.map((w) => ({ ...w, text: cleanWord(w.text) })).filter((w) => w.text)
  const white = assColor(PALETTE.white)
  const gold = assColor(PALETTE.goldBright)
  const events = []

  for (const group of groupWords(words)) {
    group.forEach((word, i) => {
      // Each word holds until the next one starts, so the burst never flickers off
      const end = i < group.length - 1 ? group[i + 1].start : word.end
      const text = group
        .map((w, j) => (j === i ? `{\\c${gold}\\fscx112\\fscy112}${w.text}{\\c${white}\\fscx100\\fscy100}` : w.text))
        .join(' ')
      events.push(
        `Dialogue: 0,${time(word.start)},${time(Math.max(end, word.start + 0.08))},Caption,,0,0,0,,{\\pos(${FRAME.width / 2},${FRAME.captionY})}${text}`
      )
    })
  }

  return `[Script Info]
ScriptType: v4.00+
PlayResX: ${FRAME.width}
PlayResY: ${FRAME.height}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,Inter Black,78,${white},${white},&H00000000&,&H96000000&,0,0,0,0,100,100,1,0,1,7,3,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events.join('\n')}
`
}
