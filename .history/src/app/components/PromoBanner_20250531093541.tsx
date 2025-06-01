'use client'

import React from 'react'

export default function PromoBanner() {
  return (
    <div className="relative rounded-xl border bg-gradient-to-br from-indigo-100/50 dark:from-indigo-900/30 to-transparent p-6 mt-8 shadow-sm transition hover:shadow-md">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">🌟 Inspired by this win?</h3>
        <p className="text-muted-foreground text-sm">
          Check out what other visionaries are building or promote your own milestone here.
        </p>
        <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">
          Discover More
        </button>
      </div>

      {/* Optional: Future ad image or gradient visuals */}
      <div className="absolute -top-4 -right-4 rotate-3">
        {/* reserved for light SVG sparkle or emoji icon */}
      </div>
    </div>
  )
}
