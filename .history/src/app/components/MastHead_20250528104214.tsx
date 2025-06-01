'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function Masthead() {
  const router = useRouter()

  return (
    <section className="bg-black text-center py-20 px-6 space-y-6">
      {/* Title */}
      <div className="text-6xl sm:text-7xl font-extrabold">
        <h1 className="leading-tight">
          <span className="bg-gradient-to-r from-blue-900 via-blue-300 to-white bg-clip-text text-transparent">
            financial
          </span>{' '}
          <span className="bg-gradient-to-r from-white via-red-300 to-red-900 bg-clip-text text-transparent">
            gurkha
          </span>
        </h1>
      </div>

      {/* Subtitle */}
      <div className="text-sm sm:text-base text-white/80 space-x-4 tracking-wide">
        <span>crypto + stocks</span>
        <span>search engine</span>
      </div>

      {/* Signature Line */}
      <p className="text-white/50 text-xs tracking-widest uppercase mt-4">
        A Kanchan Sharma Production
      </p>

      {/* CTA Button */}
      <div className="pt-6">
        <button
          onClick={() => router.push('/about')}
          className="px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
        >
          Explore the Masthead
        </button>
      </div>
    </section>
  )
}
