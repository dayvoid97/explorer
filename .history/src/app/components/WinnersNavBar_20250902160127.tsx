'use client'

import Link from 'next/link'
import Image from 'next/image'
import pippin from '../../../public/pippin.png'
import { PlusCircle, User } from 'lucide-react'

export default function WinnersNavbar() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-sm shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left Section: Add button */}
          <div className="flex-shrink-0">
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
          </div>

          {/* Center Section: Logo and Taglines */}
          <div className="flex-grow px-10 py-10 text-center">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl leading-none">
              ONLY WS IN THE CHAT
            </h1>
            <p className="text-xs font-extrabold text-green-900 mt-0.5">
              a{' '}
              <a href="/" className="hover:underline">
                financial gurkha
              </a>{' '}
              production
            </p>
          </div>

          {/* Right Section: User Profile Link */}
          <div className="flex-shrink-0">
            <Link
              href="/profile"
              className="group flex items-center justify-center p-1"
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
          </div>
        </div>
      </div>
    </div>
  )
}
