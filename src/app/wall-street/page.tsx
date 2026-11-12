import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { playfair } from '../fonts'
import { getStreetPhotos } from '@/app/lib/street-photos'
import PostcardReceivers from '@/app/components/PostcardReceivers'

const GOLD = '#C9A24B'

export const metadata: Metadata = {
  title: 'Postcards from Wall Street',
  description:
    'Wall Street as it actually looks from the sidewalk. Every photograph on this wall was shot by Financial Gurkha on foot in the Financial District of New York City: the canyons, the station, the banking halls, the bull in miniature.',
  alternates: { canonical: 'https://financialgurkha.com/wall-street' },
  openGraph: {
    title: 'Postcards from Wall Street — Financial Gurkha',
    description:
      'We walk the blocks we write from. A wall of our own photographs from Wall Street and the Financial District.',
    images: ['/wall-street/wall-street-station-mosaic.jpg'],
  },
}

/**
 * /wall-street: the full postcard wall behind the homepage's "From the
 * Street" strip. Same source as the homepage (lib/street-photos.ts, baked
 * from public/wall-street/ at build time), presented as postcards: white
 * frame, caption and location on the card, a small FG stamp in the corner.
 * Dropping a new photo into public/wall-street/ adds it here automatically.
 */
export default async function WallStreetPage({
  searchParams,
}: {
  searchParams: Promise<{ receivers?: string }>
}) {
  const { receivers } = await searchParams
  const photos = getStreetPhotos()

  return (
    <div className="bg-[#0A0A0A] text-white">
      <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          From the Street · Financial District, New York
        </p>
        <h1
          className={`${playfair.className} mt-5 max-w-3xl text-[40px] font-semibold leading-[1.05] sm:text-[56px]`}
        >
          Postcards from Wall Street
        </h1>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <p className="max-w-xl text-[17px] font-light leading-relaxed text-white/70">
            We walk the blocks we write about. Financial Gurkha is researched and written from Wall
            Street and the surrounding Financial District, on the ground at least twice a week, and
            this is the view from those walks: the canyons, the station mosaic, the banking halls,
            the bull in miniature. No stock photos. Every frame on this wall is ours.
          </p>
          <dl className="flex gap-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            <div>
              <dt className="sr-only">Postcards</dt>
              <dd className="text-2xl font-semibold tracking-normal text-white">{photos.length}</dd>
              <dd className="mt-1">postcards</dd>
            </div>
            <div>
              <dt className="sr-only">Neighborhood</dt>
              <dd className="text-2xl font-semibold tracking-normal text-white">1</dd>
              <dd className="mt-1">neighborhood</dd>
            </div>
            <div>
              <dt className="sr-only">Stock photos</dt>
              <dd className="text-2xl font-semibold tracking-normal text-white">0</dd>
              <dd className="mt-1">stock photos</dd>
            </div>
          </dl>
        </div>
        <div className="mt-12">
          <PostcardReceivers defaultOpen={receivers === '1'} />
        </div>
      </section>

      <section
        aria-label="The postcard wall"
        className="mx-auto max-w-[1400px] px-4 pb-20 pt-14 sm:px-6"
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo, i) => (
            <figure key={photo.src} className="group">
              {/* The white frame is the postcard */}
              <div className="relative bg-white p-2 pb-3 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                  <Image
                    src={photo.src}
                    alt={photo.caption || `Wall Street, ${photo.location}`}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
                    quality={75}
                    priority={i < 4}
                    className="object-cover grayscale-[35%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                {/* the stamp */}
                <div
                  aria-hidden
                  className="absolute right-4 top-4 rotate-6 border border-dashed px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
                  style={{ borderColor: GOLD, color: GOLD, background: 'rgba(10,10,10,0.55)' }}
                >
                  FG · NYC
                </div>
                <figcaption className="px-1 pt-3 text-black">
                  <p className="flex items-baseline justify-between gap-3">
                    <span className="text-[14px] font-medium leading-snug">
                      {photo.caption || photo.location}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">
                      No. {String(i + 1).padStart(2, '0')}
                    </span>
                  </p>
                  <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                    {photo.location}
                  </p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-20 border-t border-white/10 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
                From these blocks
              </p>
              <p
                className={`${playfair.className} mt-4 max-w-xl text-[28px] font-semibold leading-tight sm:text-[34px]`}
              >
                Read what we write from here.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/news"
                className="border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                Latest briefs →
              </Link>
              <Link
                href="/links"
                className="border border-white/20 px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
              >
                Every story, one page →
              </Link>
            </div>
          </div>
          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            All photographs © Financial Gurkha · Shot on foot in the Financial District, New York
            City
          </p>
        </div>
      </section>
    </div>
  )
}
