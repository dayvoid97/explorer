/**
 * The "Gurkha Splash" video style: one source of truth for colors and layout,
 * shared by the frame renderer and the video assembler.
 *
 * Colors come straight from public/logo.png: near-black ground, off-white
 * "Financial", gold "Gurkha". The extra golds are lighter and darker steps of
 * the logo gold, used only for the splashes.
 */
export const PALETTE = {
  black: '#080808',
  white: '#F8F8F8',
  gold: '#C8A048',
  goldBright: '#E8C062',
  goldDeep: '#8F6A22',
  champagne: '#F1DCA0',
}

/*
 * Reel layout (1080×1920). The footage window is 3:4, so Midjourney renders
 * straight into it (--ar 3:4), and it sits inside Instagram's 3:4 grid crop
 * (roughly y 240-1680). Captions sit in the lower part of the window, above
 * the platform's bottom UI.
 */
export const FRAME = {
  width: 1080,
  height: 1920,
  window: { x: 60, y: 330, w: 960, h: 1280, radius: 28 },
  captionY: 1545, // vertical center of the caption line, just under a "low" number plate
}

/*
 * Added to every Midjourney prompt so footage from different stories still looks
 * like one channel: punchy and warm against the black-and-gold frame. Numbers and
 * words are never generated; they are composited as plates and captions.
 */
export const MIDJOURNEY_STYLE =
  'cinematic, high contrast, deep black shadows, warm gold highlights, one vivid accent color, crisp detail, dynamic composition, no text, no words, no logos'
