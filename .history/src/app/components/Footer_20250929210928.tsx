'use client'
import Link from 'next/link'

// src/app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-auto border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h1
              className="text-xl   dark:text-gray-100 mb-3"
              style={{
                fontFamily: "'Freight Big Pro', serif",
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              Financial Gurkha
            </h1>
            <p
              className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-md"
              style={{
                fontFamily: 'Helvetica',
                fontWeight: 500,
              }}
            >
              Only Ws in the CHAT. Financial Gurkha is for the WINNERS.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/eula"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  EULA
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/copyright"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Copyright Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about/kanchan"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <a
                  href="sharma.kanchan3154@gmail.com"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Email Support
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} FinancialGurkha. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <Link
                href="/legal/terms"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/legal/privacy"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/legal/copyright"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Copyright
              </Link>
              <span className="text-gray-400">•</span>
              <span>Made with ❤️ in Caldwell, NJ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
