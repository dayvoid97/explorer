'use client'

import React from 'react'

export default function Masthead() {
  return (
    <section className="text-center py-20 px-6">
      <div className="text-6xl sm:text-7xl font-extrabold bg-black">
        <h1 className="leading-tight">
          <span className="bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent">
            financial
          </span>{' '}
          <span className="text-bold bg-gradient-to-r  from-white to-red-600 bg-clip-text">
            gurkha
          </span>
        </h1>
      </div>

      <div className="mt-4 text-sm sm:text-base text-white/80 space-x-4 tracking-wide">
        <span>crypto + stocks</span>
        <span>search engine</span>
      </div>
    </section>
  )
}
