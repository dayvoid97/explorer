import localFont from 'next/font/local'

/**
 * Playfair Display, the brand serif (SIL Open Font License, see OFL-PlayfairDisplay.txt).
 *
 * Served from the repo rather than through next/font/google: Google Fonts now
 * and then answers with a font URL next/font cannot parse, and that fails the
 * whole build ("Cannot read properties of null (reading '1')"). This is the
 * variable font, so one file covers every weight from 400 to 900.
 *
 * Use `playfair.className` to set it directly, or `playfair.variable` to expose
 * it as var(--font-playfair).
 */
export const playfair = localFont({
  src: './PlayfairDisplay.ttf',
  weight: '400 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-playfair',
})
