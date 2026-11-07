/**
 * "From the Street": the Wall Street postcards on the homepage.
 *
 * Every web image in public/wall-street/ is shown, with no code change. Drop
 * the files in and deploy. The list is read once at build time in
 * next.config.ts and baked in as STREET_PHOTOS, because the server functions
 * that regenerate the homepage cannot see public/ on Vercel.
 *
 * Captions: public/wall-street/captions.json can give a file a caption and a
 * location ({ "file.jpg": { "caption": "...", "location": "..." } }); files
 * listed there come first, in that order. Anything not listed takes its caption
 * from a descriptive file name ("charging-bull-at-dawn.jpg" reads "Charging
 * bull at dawn"); camera names such as IMG_1234.jpg show without one.
 *
 * Web formats only (jpg, jpeg, png, webp, avif). Browsers outside Safari cannot
 * show HEIC, so iPhone HEIC files are skipped; convert them to JPEG first.
 */
export interface StreetPhoto {
  src: string
  caption: string
  location: string
}

export function getStreetPhotos(): StreetPhoto[] {
  try {
    return JSON.parse(process.env.STREET_PHOTOS || '[]') as StreetPhoto[]
  } catch {
    return []
  }
}
