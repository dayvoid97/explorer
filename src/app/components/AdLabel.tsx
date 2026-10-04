import Link from 'next/link'

export const HOW_WE_MAKE_MONEY_PATH = '/how-does-financial-gurkha-make-money'

/**
 * The "Advertisement" label shown on every ad unit, with an ⓘ that links to the
 * page explaining how Financial Gurkha makes money. Readers should always be
 * able to tell an ad from the article, and find out why it is there.
 *
 * Deliberately plain: small caps text, no background, nothing that competes
 * with the ad or the article.
 */
export function AdLabel({ align = 'right' }: { align?: 'left' | 'center' | 'right' }) {
  const justify =
    align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'

  return (
    <div className={`mb-2 flex items-center gap-1.5 ${justify}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        Advertisement
      </span>
      <Link
        href={HOW_WE_MAKE_MONEY_PATH}
        aria-label="Why Financial Gurkha shows ads"
        title="Why we show ads"
        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-400 text-[9px] font-bold leading-none text-gray-500 no-underline transition hover:border-gray-900 hover:text-gray-900"
      >
        i
      </Link>
    </div>
  )
}
