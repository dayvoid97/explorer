'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import MastheadInline from './MastHeadInline'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevent scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    const handleScroll = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  return (
    <header className="rounded-5xl backdrop-blur-md border-b z-50 sticky top-0 shadow-sm">
      <nav className="rounded-5xl max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left side - Mobile menu button (visible on mobile) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

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
        {/* Right side - Desktop nav links (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/chronoW"
            className="text-lg sm:text-xl font-extrabold text-blue-500 hover:text-blue-400 hover:scale-105 transition-transform duration-200"
          >
            CHRONODUBS
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </div>

        {/* Right side - Placeholder for mobile (to maintain centering) */}
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
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-red-400 transition p-1"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nav Links */}
            <div className="space-y-3 text-white pt-2">
              <MobileNavLinks onLinkClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLinks() {
  return (
    <>
      <Link
        href="/wins"
        className="text-sm sm:text-base font-medium hover:text-blue-400 transition"
      >
        PRESS IT
      </Link>
      <Link
        href="/winners"
        className="text-black-600 dark:text-white-400 text-5xl sm:text-6xl font-extrabold hover:underline tracking-wider drop-shadow-lg transition-transform duration-300 hover:scale-105"
      >
        W
      </Link>
      <Link
        href="/profile"
        className="text-sm sm:text-base font-medium transition hover:text-blue-400"
      >
        Account
      </Link>
    </>
  )
}

function MobileNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <>
      <Link
        href="/profile"
        className="block text-base font-medium transition hover:text-blue-400 py-2.5"
        onClick={onLinkClick}
      >
        Account
      </Link>
      <Link
        href="/wins"
        className="block text-base font-medium hover:text-blue-400 transition py-2.5"
        onClick={onLinkClick}
      >
        PRESS IT
      </Link>
      <Link
        href="/winners"
        className="text-black-600 dark:text-white-400 text-2xl sm:text-6xl font-extrabold hover:underline tracking-wider drop-shadow-lg transition-transform duration-300 hover:scale-105"
      >
        DUBS
      </Link>
      <Link
        href="/chronoW"
        className="text-black-600 dark:text-white-400 text-2xl sm:text-6xl font-extrabold hover:underline tracking-wider drop-shadow-lg transition-transform duration-300 hover:scale-105"
      >
        Chrono Dubs
      </Link>
    </>
  )
}
