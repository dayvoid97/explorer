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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      {/* Main Header */}
      <div className="sticky z-50 bg-white dark:bg-gray-900 ">
        <div className="mx-auto max-w-7xl px-4 py-4">
          {/* Main Navigation Row */}
          <div className="flex items-center justify-between">
            {/* Left Spacer (empty to balance the layout) */}
            <div className="flex-1 hidden md:block" />

            {/* Center Title */}
            <h1 className="flex-1 text-center text-lg sm:text-xl font-bold">
              ONLY DUBS IN THE CHAT
            </h1>

            {/* Right Actions */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/wins"
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                >
                  <PlusCircle size={50} />
                  DROP IT
                </Link>

                <Link
                  href="/profile"
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                >
                  <Image
                    src={pippin}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600"
                aria-label="Toggle menu"
              >
                <Menu size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="w-full">
          <MastheadInline />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with fade-in animation */}
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-out ${
              isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
            onClick={closeMobileMenu}
          />

          {/* Menu panel with slide-in animation */}
          <div
            className={`w-full fixed top-0 right-0 bottom-0 bg-white dark:bg-gray-900 transform transition-transform duration-500 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Navigation with staggered fade-in animation */}
            <nav className="p-4">
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className={`flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? '200ms' : '0ms',
                  }}
                >
                  <Image
                    src={pippin}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full mr-3 bg-black"
                  />
                  Account
                </Link>

                <Link
                  href="/wins"
                  onClick={closeMobileMenu}
                  className={`flex items-center px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? '300ms' : '0ms',
                  }}
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
