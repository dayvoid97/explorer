'use client'

import { useEffect, useState } from 'react'
import { INSTAGRAM_URL, POSTCARD_RECEIVERS } from '@/app/lib/street-photos'

const GOLD = '#C9A24B'

/**
 * "Monthly Postcard Receivers": Spotify counts monthly listeners; we count
 * the people the postcards reach, which is the @financialgurkha follower
 * count. The band shows the number; its button opens a heads-up popup before
 * sending the reader to Instagram, so the handoff is a choice, not a bounce.
 * `defaultOpen` lets a shared link (…?receivers=1) open the popup directly.
 */
export default function PostcardReceivers({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open ])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5 border border-white/10 bg-white/[0.03] px-5 py-5 sm:px-7">
        <div className="flex items-center gap-5">
          <p className="text-[38px] font-semibold leading-none">{POSTCARD_RECEIVERS}</p>
          <div>
            <p
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: GOLD }}
            >
              Monthly Postcard Receivers
            </p>
            <p className="pt-1 max-w-sm text-[13px] leading-snug text-white/55">
              Spotify counts monthly listeners. We count the people each postcard reaches, on
              Instagram, the day it is shot.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] transition hover:bg-white hover:text-black"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          Become a receiver →
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receivers-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm border border-white/15 bg-[#111111] px-7 py-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Stay here"
              className="absolute right-3 top-2 px-2 py-1 text-lg leading-none text-white/50 transition hover:text-white"
            >
              ×
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Monthly Postcard Receivers
            </p>
            <h2 id="receivers-popup-title" className="pt-3 text-[22px] font-semibold leading-snug">
              You are about to go to Instagram
            </h2>
            <p className="pt-3 text-[14px] leading-relaxed text-white/60">
              Follow <span className="text-white">@financialgurkha</span> there and every postcard
              from Wall Street lands in your feed the day we shoot it, before it reaches this
              wall. {POSTCARD_RECEIVERS} readers already receive them.
            </p>
            <div className="flex flex-col gap-3 pt-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="border px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] transition hover:bg-white hover:text-black"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                Continue to Instagram →
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-white/20 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:border-white hover:text-white"
              >
                Stay here
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
