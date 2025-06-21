'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

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
      <nav className="rounded-5xl max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold">
          FINANCIAL GURKHA
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile nav modal */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="animate-fadeIn relative w-full max-w-sm mt-20 mx-6 bg-black/90 p-6 rounded-xl border border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400 transition"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav Links */}
            <div className="space-y-6 pt-6">
              <NavLinks />
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
        href="/profile"
        className="block text-xl font-medium text-gray-100 dark:text-gray-200 hover:text-blue-400 transition"
      >
        Account
      </Link>
      <Link
        href="/wins"
        className="block text-xl font-medium text-gray-100 dark:text-gray-200 hover:text-blue-400 transition"
      >
        Press It
      </Link>
      <Link
        href="/winners"
        className="block text-3xl font-bold text-blue-500 dark:text-blue-400 hover:underline tracking-wide"
      >
        W
      </Link>
    </>
  )
}
