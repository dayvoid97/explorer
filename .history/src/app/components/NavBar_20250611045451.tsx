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
    <header className=" rounded-5xl backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 sticky top-0 shadow-sm">
      <nav className="rounded-5xl max-w-7xl mx-auto px-6 py-4 flex items-center justify-between ">
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
      {/* Mobile nav modal */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="relative max-w-sm w-full m-6 mx-auto bg-black/80 p-6 rounded-xl border border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()} // prevent close on inside click
          >
            {/* Close + Links here */}
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
        className="text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        Account
      </Link>
      <Link
        href="/wins"
        className="text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        Press It
      </Link>
      <Link
        href="/winners"
        className="text-6xl font-bold text-blue-700 dark:text-blue-400 hover:underline tracking-wide"
      >
        W
      </Link>
    </>
  )
}
