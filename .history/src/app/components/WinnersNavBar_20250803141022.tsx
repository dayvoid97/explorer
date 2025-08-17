'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'
import { UserCircle, PlusCircle } from 'lucide-react'

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()

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
      className={`sticky top-0 z-50 border-b transition-all duration-300 backdrop-blur-md ${
        scrolled ? (isLight ? 'bg-white text-black' : 'bg-black text-white') : 'bg-transparent'
      }`}
    >
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left - Logo and Title */}
        <div className="flex flex-col items-start">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-left">
            ONLY WS IN THE CHAT 🏆🏆🏆🏆
          </span>
          <Link href="/" className="text-sm sm:text-base font-bold tracking-wide hover:underline">
            FINANCIAL GURKHA <sup className="ml-1 text-xs text-blue-500">BETA</sup>
          </Link>
          <MastheadInline />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/wins"
            className="group bg-bla relative inline-flex items-center px-4 lg:px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            DROP IT
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/profile"
            aria-label="Go to your account"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <UserCircle className="w-7 h-7" />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
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
        </div>
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
                href="/profile"
                className="block text-base font-medium transition hover:text-blue-400 py-2.5"
              >
                Account
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
