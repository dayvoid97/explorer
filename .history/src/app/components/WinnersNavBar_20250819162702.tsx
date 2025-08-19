'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'
import Image from 'next/image'
import pippin from '../../../public/pippin.png'
import { PlusCircle, Menu, X } from 'lucide-react'

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { resolvedTheme } = useTheme()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      {/* Main Header */}
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                ONLY WS IN THE CHAT 🏆
              </h1>
              <Link
                href="/"
                className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                FINANCIAL GURKHA
                <sup className="ml-1 text-xs text-blue-500">BETA</sup>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/winners"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Winners Gallery
              </Link>

              <Link
                href="/wins"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                DROP IT
              </Link>

              <Link href="/profile" className="ml-4">
                <Image src={pippin} alt="Profile" width={32} height={32} className="rounded-full" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Mobile Masthead */}
          <div className="md:hidden pb-4">
            <MastheadInline />
          </div>

          {/* Desktop Masthead */}
          <div className="hidden md:block pb-4">
            <MastheadInline />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />

          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Image
                    src={pippin}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full mr-3"
                  />
                  Account
                </Link>

                <Link
                  href="/winners"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Winners Gallery
                </Link>

                <Link
                  href="/wins"
                  onClick={closeMobileMenu}
                  className="flex items-center px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 mr-3" />
                  DROP IT
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
