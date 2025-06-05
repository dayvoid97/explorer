'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Optional: prevent scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
  }, [isMobileMenuOpen])

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 sticky top-0">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-black dark:text-white"
        >
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

      {/* Mobile nav dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 flex flex-col bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <NavLinks />
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
        className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        Account
      </Link>
      <Link
        href="/wins"
        className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        Press It
      </Link>
      <Link
        href="/winners"
        className="text-lg font-bold text-blue-700 dark:text-blue-400 hover:underline tracking-wide"
      >
        W
      </Link>
    </>
  )
}
