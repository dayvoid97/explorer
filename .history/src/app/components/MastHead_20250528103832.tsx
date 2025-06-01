'use client'

import React from 'react'

export default function Masthead() {
  return (
    <section className="bg-black text-center py-20 px-6">
      <div className="text-6xl sm:text-7xl font-extrabold">
        <h1 className="leading-tight">
          <span className="bg-gradient-to-r text-blue-800 from-blue-900 to-white bg-clip-text text-transparent">
            financial
          </span>{' '}
          <span className="bg-gradient-to-r from-white to-red-900 bg-clip-text text-transparent">
            gurkha
          </span>
        </h1>
      </div>

      <div className="mt-4 text-sm sm:text-base text-white space-x-4 tracking-wide">
        <span>crypto + stocks</span>
        <span>search engine</span>
      </div>
    </section>
  )
}
