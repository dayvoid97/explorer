import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getStreetPhotos, INSTAGRAM_URL, POSTCARD_RECEIVERS } from '@/app/lib/street-photos'
import PostcardReceivers from '@/app/components/PostcardReceivers'

const GOLD = '#C9A24B'

export const metadata: Metadata = {
  title: 'Postcards from Wall St',
  description:
    'The compact grid: every Financial Gurkha postcard from Wall Street and the Financial District in one tight wall, shot on our own walks. No stock photos.',
  alternates: { canonical: 'https://financialgurkha.com/postcards-from-wall-st' },
  openGraph: {
    title: 'Postcards from Wall St — Financial Gurkha',
    description: 'We walk the blocks we write about. The full postcard grid.',
    images: ['/wall-street/wall-street-station-mosaic.jpg'],
  },
}

/**
 * /postcards-from-wall-st: the postcard wall in Instagram-profile form, the
 * way /links presents articles on desktop: a profile header (avatar, handle,
 * post count), a bio, action buttons, then a tight three-column grid of 3:4
 * tiles with 4px gaps and the caption on hover. Same photo source as the
 * homepage strip and /wall-street (lib/street-photos.ts), so a photo dropped
 * into public/wall-street/ appears here automatically.
 */
export default async function PostcardsFromWallStPage({
  searchParams,
}: {
  searchParams: Promise<{ receivers?: string }>
}) {
  const { receivers } = await searchParams
  const photos = getStreetPhotos()
  const avatar = photos.find((p) => p.src.includes('kanchan-wallst')) ?? photos[0]

  return (
    <div className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-[935px] px-2 pb-16 sm:px-4">
        {/* ============ profile header ============ */}
        <header className="flex items-center gap-6 px-2 pt-10 sm:gap-10 sm:px-4 sm:pt-14">
          {avatar ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-offset-4 ring-offset-[#0A0A0A] sm:h-36 sm:w-36" style={{ ['--tw-ring-color' as string]: GOLD }}>
              <Image
                src={avatar.src}
                alt="Financial Gurkha on Wall Street"
                fill
                sizes="144px"
                quality={75}
                className="object-cover"
                priority
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="text-lg font-light tracking-wide sm:text-xl">financialgurkha</p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="border px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                Visit Instagram
              </a>
            </div>
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-10">
              <div>
                <dd className="text-[17px] font-semibold leading-none">{photos.length}</dd>
                <dt className="pt-1 text-[13px] text-white/60">postcards</dt>
              </div>
              <div>
                <dd className="text-[17px] font-semibold leading-none">{POSTCARD_RECEIVERS}</dd>
                <dt className="pt-1 text-[13px] text-white/60">monthly postcard receivers</dt>
              </div>
              <div>
                <dd className="text-[17px] font-semibold leading-none">0</dd>
                <dt className="pt-1 text-[13px] text-white/60">stock photos</dt>
              </div>
            </dl>
            <div className="mt-5 hidden text-[14px] leading-snug sm:block">
              <p className="font-semibold">Postcards from Wall Street</p>
              <p className="text-white/75">
                We walk the blocks we write about. Shot on foot in the Financial District, New
                York City.
              </p>
              <Link href="/wall-street" className="font-semibold hover:underline" style={{ color: GOLD }}>
                financialgurkha.com/wall-street
              </Link>
            </div>
          </div>
        </header>

        {/* bio + actions, full width on small screens */}
        <div className="px-2 pt-5 text-[14px] leading-snug sm:hidden">
          <p className="font-semibold">Postcards from Wall Street</p>
          <p className="text-white/75">
            We walk the blocks we write about. Shot on foot in the Financial District, New York
            City.
          </p>
        </div>
        <div className="flex gap-3 px-2 pt-5 sm:px-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex-1 border py-2.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            Visit Instagram
          </a>
          <Link
            href="/wall-street"
            className="flex-1 border border-white/25 py-2.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white hover:text-white"
          >
            The full wall
          </Link>
        </div>

        <div className="px-2 pt-8 sm:px-4">
          <PostcardReceivers defaultOpen={receivers === '1'} />
        </div>

        {/* ============ tab strip ============ */}
        <div className="mt-10 flex justify-center border-t border-white/15">
          <p className="-mt-px flex items-center gap-2 border-t border-white pt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.25em]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Postcards
          </p>
        </div>

        {/* ============ the grid: 3 columns, 4px gaps, 3:4 tiles ============ */}
        <div className="mt-1 grid grid-cols-3 gap-1">
          {photos.map((photo, i) => (
            <figure key={photo.src} className="group relative aspect-[3/4] overflow-hidden bg-white/5">
              <Image
                src={photo.src}
                alt={photo.caption || `Wall Street, ${photo.location}`}
                fill
                sizes="(min-width: 935px) 309px, 33vw"
                quality={70}
                priority={i < 6}
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <figcaption className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 px-3 text-center opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="text-[13px] font-semibold leading-snug sm:text-[15px]">
                  {photo.caption || photo.location}
                </span>
                <span className="pt-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/60">
                  {photo.location} · No. {String(i + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          All photographs © Financial Gurkha · Financial District, New York City ·{' '}
          <Link href="/wall-street" className="underline decoration-white/30 hover:text-white/70">
            Read the wall with captions
          </Link>
        </p>
      </div>
    </div>
  )
}
