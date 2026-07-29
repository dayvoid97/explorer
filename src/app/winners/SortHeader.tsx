'use client'

import React from 'react'

const SORT_OPTIONS = [
  { value: 'recent', label: 'RECENT' },
  { value: 'celebrated', label: 'CELEBRATED' },
  { value: 'hottest', label: 'HOTTEST' },
] as const

const SORT_LABELS: Record<typeof SORT_OPTIONS[number]['value'], string> = {
  recent: 'LATEST DUBS.',
  celebrated: 'MOST CELEBRATED.',
  hottest: 'HOTTEST RIGHT NOW.',
}

interface SortHeaderProps {
  sortBy: typeof SORT_OPTIONS[number]['value']
  setSortBy: (sort: typeof SORT_OPTIONS[number]['value']) => void
}

export default function SortHeader({ sortBy, setSortBy }: SortHeaderProps) {
  return (
    <header className="max-w-3xl mx-auto px-4 mt-5 mb-8">
      {/* Ultra-minimal Title */}
      <h2
        className="text-3xl font-bold  mb-6 tracking-tighter"
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        {SORT_LABELS[sortBy]}
      </h2>

      {/* Text-only Sort Controls */}
      <div className="flex gap-6">
        {SORT_OPTIONS.map((option) => {
          const isActive = sortBy === option.value
          return (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`
                text-[10px] font-bold tracking-[0.15em] transition-all duration-200
                ${isActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}
              `}
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              {option.label}
              {/* Minimalist underscore indicator */}
              <div
                className={`h-[1px] mt-1 transition-all duration-300 ${
                  isActive ? 'bg-blue-500 w-full' : 'bg-transparent w-0'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Thin Technical Divider */}
      <div className="mt-4 h-[1px] w-full bg-gray-800/50" />
    </header>
  )
}
