'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'

// --- Nav Data (for simplicity and consolidation) ---
// Frontend-only mode: blog + winners only. No account/API routes.
const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/winners', label: 'W' },
]

// --- Theme Toggle Component ---

// --- Desktop Links Component (Unchanged) ---
function DesktopNavLinks() {
  const commonLinkClasses =
    'text-lg sm:text-xl font-extrabold text-foreground hover:scale-105 transition-transform duration-200'

  const customStyle = {
    fontFamily: 'Overused Grotesk',
    fontWeight: 500,
    color: 'white',
    letterSpacing: '-0.01rem',
    fontOpticalSizing: 'auto',
    fontFeatureSettings: '"kern" 1',
  } as React.CSSProperties

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link href="/blog" className={commonLinkClasses} style={customStyle}>
        Blog
      </Link>

      <Link
        href="/winners"
        className="text-foreground text-5xl sm:text-6xl font-extrabold hover:underline tracking-wider drop-shadow-lg transition-transform duration-300 hover:scale-105"
        style={{ ...customStyle, letterSpacing: '-0.1rem' }}
      >
        W
      </Link>
    </div>
  )
}

// --- Mobile Links Component ---
function MobileNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
  // text-left for left alignment
  const baseClasses =
    'block text-lg font-medium transition hover:text-blue-400 py-4 border-b border-gray-700 w-full text-left'

  const customStyle = {
    fontFamily: 'Overused Grotesk',
    fontWeight: 500,
    letterSpacing: '0.2rem',
  }

  return (
    <div className="pt-4 pb-4 space-y-0">
      <Link href="/blog" className={baseClasses} style={customStyle} onClick={onLinkClick}>
        Blog
      </Link>
      <Link
        href="/winners"
        className={`${baseClasses} border-b-0`}
        style={customStyle}
        onClick={onLinkClick}
      >
        DUBS
      </Link>
    </div>
  )
}

// --- Main Navbar Component ---
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu on desktop resize
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleScroll = () => {
      // Close the menu instantly upon any scroll event, but only if it's open
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    // Attach listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      // Cleanup listeners
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  const menuIcon = isMobileMenuOpen ? (
    <X className="w-8 h-8 text-white" />
  ) : (
    <Menu className="w-8 h-8 text-white" />
  )

  return (
    <header className="rounded-5xl bg-black  backdrop-blur-md border-b z-50 sticky top-0 shadow-sm">
      {' '}
      <nav className="rounded-5xl max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-3 flex flex-col md:flex-row items-start justify-between ">
        {' '}
        <div className="flex items-center w-full md:w-auto space-x-4">
          {' '}
          {/* 💡 Used space-x-4 for gap between button and logo */}
          {/* Mobile Menu Button - Leftmost position */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none p-2 -ml-2" // 💡 Negative margin to pull button fully to the edge
              aria-label="Toggle menu"
            >
              {menuIcon}
            </button>
          </div>
          {/* Logo and Masthead - Left-aligned */}
          <div className="flex justify-start flex-grow md:flex-grow-0">
            <Link
              href="/"
              className="padding-1ch text-white font-medium hover:scale-105 transition-transform duration-200 tracking-wider flex flex-col items-start" // 💡 items-start for left alignment of logo lines
              style={{
                fontFamily: "'Freight Big Pro', serif",
                fontWeight: 500,
                letterSpacing: '-0.1rem',
              }}
            >
              {/* Line 1: Masthead. The former "BETA" superscript was removed —
                  AI assistants were reading it off the homepage and describing
                  the publication as "small, early-stage" in their answers. A
                  beta badge tells every reader and every model that the work is
                  provisional, which is the opposite of what a research desk
                  needs to signal. */}
              <span
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none"
                style={{ letterSpacing: '0.1rem' }}
              >
                FINANCIAL GURKHA
                <sup
                  className="ml-1 align-super font-bold text-gray-400"
                  style={{
                    fontSize: '0.32em',
                    letterSpacing: '0.1rem',
                    fontFamily: 'Verdana',
                  }}
                >
                  EST. 2022
                </sup>
              </span>

              {/* Line 2: Tagline */}
              <span
                className="text-xs sm:text-sm md:text-base font-medium tracking-widest mt-1 uppercase"
                style={{
                  fontFamily: "'Overused Grotesk', sans-serif",
                  fontWeight: 500,
                  color: 'white',
                }}
              >
                FINANCIAL GURKHA IS FOR THE WINNERS
              </span>
            </Link>
          </div>
        </div>
        {/* Desktop Navigation */}
        <DesktopNavLinks />
      </nav>
      {/* MOBILE MENU - Below Logo, Black Background, White Text (Left-Aligned) */}
      {isMobileMenuOpen && (
        <div className="bg-black text-white w-full shadow-lg transform transition-transform duration-300 md:hidden">
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            {/* Nav Links Container */}
            <div className="px-4 sm:px-6">
              {' '}
              {/* 💡 Ensure padding matches main nav padding */}
              <MobileNavLinks onLinkClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
