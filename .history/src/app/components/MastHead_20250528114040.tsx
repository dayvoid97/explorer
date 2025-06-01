'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDownRight, ArrowRight } from 'lucide-react'

export default function Masthead() {
  const router = useRouter()

  return (
    <section className="relative bg-black text-center py-5 px-6 space-y-6">
      {/* Title */}
      <div className="text-6xl sm:text-7xl font-extrabold">
        <h1 className="leading-heavy">
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
      <div className="flex items-center justify-center gap-2 mt-1">
        <p className="text-white text-xs tracking-widest uppercase">A Kanchan Sharma Production</p>
        <button
          onClick={() => router.push('/about')}
          className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition"
          aria-label="Financial Gurkha MASTHEAD. Presented by Akash and Kanchan"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {/* Bright White Arrow */}
    </section>
  )
}
