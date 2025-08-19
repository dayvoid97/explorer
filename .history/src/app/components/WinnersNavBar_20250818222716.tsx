'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'
import Image from 'next/image'
import pippin from '../../../public/pippin.png'
import { PlusCircle, Menu, X } from 'lucide-react'

const SCROLL_THRESHOLD = 10

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()

  // Optimized scroll handler with throttling
  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD)
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Mobile menu handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 mb-5 transition-all duration-200 ${
          scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 mt-6">
            {/* Logo Section */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                ONLY WS IN THE CHAT 🏆
              </h1>

              <Link
                href="/"
                className="inline-flex items-center text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                FINANCIAL GURKHA
                <sup className="ml-1 text-xs text-blue-500 font-medium">BETA</sup>
              </Link>

              <div className="hidden sm:block mt-2">
                <MastheadInline />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Drop It Button */}
              <Link
                href="/wins"
                className="group inline-flex items-center px-4 lg:px-6 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">DROP IT</span>
                <span className="sm:hidden">+</span>
              </Link>

              {/* Profile Image */}
              <Link
                href="/profile"
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Go to your profile"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                  <Image
                    src={pippin}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full"
                    priority
                  />
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Mobile Masthead */}
          <div className="sm:hidden pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <MastheadInline />
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  )
}

// Separate Mobile Menu Component for better organization
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  const menuItems = [
    { href: '/profile', label: 'Account', icon: null },
    { href: '/winners', label: 'Winners Gallery', icon: null, highlight: true },
    { href: '/wins', label: 'Post a Win', icon: PlusCircle },
  ]

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-6">
          <ul className="space-y-3">
            {menuItems.map(({ href, label, icon: Icon, highlight }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    highlight
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5 mr-3" />}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Financial Gurkha <span className="text-blue-500">BETA</span>
          </p>
        </div>
      </div>
    </div>
  )
}
