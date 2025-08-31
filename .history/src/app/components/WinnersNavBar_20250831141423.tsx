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
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 ">
        <div className="mx-auto px-4 py-4 flex flex-col  text-center space-y-1">
          <div className="text-xxl font-semibold uppercase  ">Only Ws in the Chat 🏆</div>
          <div className="flex justify-between w-full">
            {/* Center Title */}
            <h1 className="text-lg sm:text-xl font-bold mx-auto">
              FINANCIAL GURKHA IS FOR THE WINNERS
            </h1>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/wins"
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full "
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

          {/* Masthead */}
          <div className="w-full">
            <MastheadInline />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* {isMobileMenuOpen && (
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
      )} */}
    </>
  )
}
