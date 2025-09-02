'use client'
import React, { useEffect, useRef, useState } from 'react'

export default function ProgressRail({ itemIds }: { itemIds: string[] }) {
  const [active, setActive] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -60% 0px',
      threshold: 0.1,
    }
    observerRef.current = new IntersectionObserver((entries) => {
      const visible = entries.find((e) => e.isIntersecting)
      if (visible?.target?.id) setActive(visible.target.id)
    }, opts)

    itemIds.forEach((id) => {
      const el = document.getElementById(`win-${id}`)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [itemIds])

  return (
    <div className="bg-border pointer-events-none absolute left-5 top-0 bottom-0 hidden w-px md:block">
      {itemIds.map((id, i) => (
        <div
          key={id}
          className={`border-background absolute -left-[5px] h-2.5 w-2.5 rounded-full border transition
            ${active === `win-${id}` ? 'bg-foreground scale-110' : 'bg-muted'}`}
          style={{ top: `calc(${(i / Math.max(1, itemIds.length - 1)) * 100}% - 2px)` }}
        />
      ))}
    </div>
  )
}
