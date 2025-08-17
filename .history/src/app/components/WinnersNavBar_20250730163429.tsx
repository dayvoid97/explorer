'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme() // detects 'light' or 'dark' mode

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLight = resolvedTheme === 'light'

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? (isLight ? 'bg-white text-black' : 'bg-black text-white') : 'bg-transparent'
      }`}
    >
      <nav className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex-shrink-0 focus:outline-none p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke={isLight ? 'black' : 'white'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            <path d="M4 8h20M4 14h20M4 20h20" />
          </svg>
        </button>

        {/* Centered Title */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold  select-none">
              ONLY WS IN THE CHAT
            </span>
            <span className="text-2xl sm:text-3xl">🏆🏆🏆🏆</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className={`mt-2 text-xs sm:text-sm font-semibold tracking-wide text-center transition-colors duration-300 ${
                scrolled
                  ? isLight
                    ? 'text-black'
                    : 'text-white'
                  : isLight
                  ? 'text-white'
                  : 'text-white'
              }`}
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Link
                  href="/"
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black hover:scale-105 transition-transform duration-200 tracking-wider"
                >
                  FINANCIAL GURKHA
                  <sup className="text-xxs text-black-300 sm:text-sm md:text-base font-bold dark:text-blue-300 ml-1">
                    BETA
                  </sup>
                </Link>

                {/* Inject Masthead subcontent under the logo */}
                <MastheadInline />
              </div>
            </a>
          </div>
        </div>

        <div className="w-8 md:hidden" />
      </nav>

      {/* Mobile nav modal */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="animate-fadeIn relative w-full max-w-xs mx-4 mt-16 bg-black/90 p-6 rounded-xl border border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-red-400 transition p-1"
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="space-y-3 text-white pt-2">
              <a
                href="/about"
                className="block text-base font-medium transition hover:text-blue-400 py-2.5"
              >
                About
              </a>
              <a
                href="/profile"
                className="block text-base font-medium transition hover:text-blue-400 py-2.5"
              >
                Account
              </a>
              <a
                href="/wins"
                className="block text-base font-medium hover:text-blue-400 transition py-2.5"
              >
                PRESS IT
              </a>
              <a
                href="/winners"
                className="block text-lg font-bold text-blue-500 dark:text-blue-400 hover:underline tracking-wide py-2.5"
              >
                W
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
