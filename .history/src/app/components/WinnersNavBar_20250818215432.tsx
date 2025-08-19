'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'
import Image from 'next/image'
import pippin from '../../../public/pippin.png'
import { PlusCircle, Menu, X } from 'lucide-react'

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Optimized mobile menu handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <header
        className={`sticky   dark:border-gray-800 transition-colors duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left - Logo Section */}
            <div className="flex flex-col items-start min-w-0 flex-1">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                ONLY WS IN THE CHAT 🏆
              </div>
              <Link
                href="/"
                className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                FINANCIAL GURKHA <sup className="ml-1 text-xs text-blue-500">BETA</sup>
              </Link>
              <div className="hidden sm:block">
                <MastheadInline />
              </div>
            </div>

            {/* Right - Desktop Actions */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Drop It Button */}
              <Link
                href="/wins"
                className="group relative inline-flex items-center px-4 lg:px-6 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">DROP IT</span>
                <span className="sm:hidden">+</span>
              </Link>

              {/* Profile Image */}
              <Link
                href="/profile"
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Go to your profile"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden">
                  <Image
                    src={pippin}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Mobile Masthead */}
          <div className="sm:hidden pb-3">
            <MastheadInline />
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Account
              </Link>

              <Link
                href="/winners"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-base font-medium text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              >
                Winners Gallery
              </Link>

              <Link
                href="/wins"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                Post a Win
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
