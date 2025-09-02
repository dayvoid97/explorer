'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import MastheadInline from './MastHeadInline'
import Link from 'next/link'
import Image from 'next/image'
import pippin from '../../../public/pippin.png'
import { PlusCircle, Menu, X, User } from 'lucide-react'

export default function WinnersNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      {/* Main Header */}
      <div className="sticky top-0 z-50 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl px-10 py-10 sm:px-6 lg:px-8">
          {/* Main Navigation Row */}
          <div className="relative flex h-16 items-center justify-between">
            {/* Left Section: An empty flex-1 for alignment */}
            <div className="flex-1 hidden md:block"></div>

            {/* Center Section: Main Heading */}
            <div className="flex-grow text-center">
              <div className="md:block">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
                  ONLY WS IN THE CHAT
                </h1>
                <p className="text-s font-extrabold text-green-900 mt-0.5">
                  a{' '}
                  <a href="/" className="hover:underline">
                    financial gurkha
                  </a>{' '}
                  production
                </p>
              </div>
            </div>

            {/* Right Section: Add button, profile, and mobile menu */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              {/* Add Win Button */}
              <Link
                href="/wins"
                className="group flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ease-in-out"
                aria-label="Add a new win"
              >
                <PlusCircle
                  size={30}
                  className="text-blue-500 group-hover:scale-110 transition-transform"
                />
              </Link>

              {/* Desktop User Profile Link */}
              <Link
                href="/profile"
                className="hidden md:flex bg-black items-center justify-center  p-1 hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200 ease-in-out"
                aria-label="View profile"
              >
                <Image
                  src={pippin}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-transparent group-hover:border-blue-500"
                />
              </Link>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-label="Open mobile menu"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Masthead - You might want to consider if this always needs to be below the sticky header */}
      </div>

      {/* Mobile Menu (now slides in from right, full screen overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
            onClick={closeMobileMenu}
          ></div>

          {/* Menu Panel */}
          <div
            className={`fixed top-0 right-0 h-full w-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Image
                  src={pippin}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full mr-3 border-2 border-transparent"
                />
                Account
              </Link>

              <Link
                href="/wins"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                DROP IT
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
