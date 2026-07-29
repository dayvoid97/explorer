'use client'
import React, { useEffect, useRef, useState } from 'react'

export default function ProgressRail({ itemIds }: { itemIds: string[] }) {
  const [active, setActive] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // More sensitive for the "top" of the view
      threshold: 0,
    }
    observerRef.current = new IntersectionObserver((entries) => {
      // Find the entry that just crossed into the upper half of the screen
      const visible = entries.find((e) => e.isIntersecting)
      if (visible?.target?.id) setActive(visible.target.id)
    }, opts)

    itemIds.forEach((id) => {
      const el = document.getElementById(`win-${id}`)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [itemIds])

  const scrollTo = (id: string) => {
    const el = document.getElementById(`win-${id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pointer-events-none absolute left-5 top-0 bottom-0 hidden w-px md:block">
      {/* The main rail line */}
      <div className="via-border bg-gradient-to-b from-transparent to-transparent h-full w-full" />

      <div className="sticky top-24 -ml-[7px] flex flex-col gap-8 pointer-events-auto">
        {itemIds.map((id) => {
          const isActive = active === `win-${id}`
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`group relative flex items-center justify-center rounded-full transition-all duration-500
                ${
                  isActive
                    ? 'bg-foreground h-4 w-4 shadow-lg'
                    : 'bg-muted hover:bg-foreground/40 h-3 w-3'
                }`}
            >
              {/* Tooltip on hover */}
              <span className="bg-foreground text-background absolute left-6 whitespace-nowrap rounded px-2 py-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                Go to Win
              </span>

              {/* Pulsing ring for active state */}
              {isActive && (
                <span className="bg-foreground absolute inset-0 animate-ping rounded-full opacity-20" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
