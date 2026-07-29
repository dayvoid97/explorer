// components/GlobalScrollToTop.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function GlobalScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Hande scroll visibility
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 500px
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300 dark:bg-gray-800 hover:scale-110 active:scale-95 border border-gray-200 dark:border-gray-700
        ${isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'}
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6 text-gray-700 dark:text-gray-200" strokeWidth={2.5} />

      {/* Subtle indicator ring */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-pulse" />
    </button>
  )
}
