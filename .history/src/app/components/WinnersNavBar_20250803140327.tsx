'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'
import { UserCircle, PlusCircle, Menu, X } from 'lucide-react'

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isLight = resolvedTheme === 'light'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          scrolled
            ? `backdrop-blur-xl ${
                isLight
                  ? 'bg-white/90 border-gray-200/60 shadow-lg shadow-black/5'
                  : 'bg-gray-900/90 border-gray-800/60 shadow-lg shadow-black/20'
              } border-b`
            : 'bg-transparent border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left - Logo and Title */}
            <div className="flex flex-col items-start space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  ONLY WS IN THE CHAT
                </span>
                <div className="flex space-x-0.5">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="text-lg sm:text-xl animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      🏆
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href="/"
                  className="text-xs sm:text-sm font-bold tracking-wider hover:underline transition-all duration-200 hover:scale-105"
                >
                  FINANCIAL GURKHA
                </Link>
                <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold bg-blue-500 text-white rounded-full">
                  BETA
                </span>
              </div>

              <div className="hidden sm:block">
                <MastheadInline />
              </div>
            </div>

            {/* Right - Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link
                href="/wins"
                className="group relative inline-flex items-center px-4 lg:px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                DROP IT
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                href="/profile"
                aria-label="Go to your account"
                className="group p-2.5 lg:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <UserCircle className="w-6 h-6 lg:w-7 lg:h-7 group-hover:text-blue-500 transition-colors duration-300" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-lg font-black bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                MENU
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                FINANCIAL GURKHA
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-6 space-y-1">
            <Link
              href="/wins"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center w-full p-4 text-left font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <PlusCircle className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              Drop Intel / Dub
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center w-full p-4 text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <UserCircle className="w-5 h-5 mr-3" />
              Account
            </Link>

            <Link
              href="/winners"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center w-full p-4 text-left font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <span className="w-5 h-5 mr-3 text-center font-black">W</span>
              Winners
            </Link>
          </div>

          {/* Mobile Masthead */}
          <div className="px-6 pb-6 sm:hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <MastheadInline />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
