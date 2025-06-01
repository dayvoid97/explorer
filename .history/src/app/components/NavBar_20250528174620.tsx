// src/app/components/Navbar.tsx

'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-white shadow-md dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="text-6xl font-bold">
          FinancialGurkha
        </Link>

        {/* Right side: Navigation links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/wins"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
          >
            Post Your Ws
          </Link>
          <Link
            href="/winners"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
          >
            Winners
          </Link>

          <Link
            href="/profile"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
          >
            Account
          </Link>
        </div>
      </nav>
    </header>
  )
}
