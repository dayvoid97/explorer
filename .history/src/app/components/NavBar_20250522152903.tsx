// src/app/components/Navbar.tsx

'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-white shadow-md dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="text-xl font-bold text-blue-700 dark:text-blue-300">
          FinancialGurkha
        </Link>

        {/* Right side: Account link */}
        <div className="space-x-4">
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
