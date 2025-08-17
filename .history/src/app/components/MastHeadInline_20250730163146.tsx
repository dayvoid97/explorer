'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function MastheadInline() {
  const router = useRouter()

  return (
    <div className="mt-1 flex flex-col items-center justify-center space-y-1">
      <div className="text-xs sm:text-sm text-black dark:text-white tracking-wide space-x-2">
        <span>crypto + stocks</span>
        <span>search engine</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold">
          A Kanchan Sharma Production
        </p>
        <button
          onClick={() => router.push('/about')}
          className="p-1.5 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition"
          aria-label="About Financial Gurkha"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
