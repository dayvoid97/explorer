'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function MastheadInline() {
  const router = useRouter()

  return (
    <div className="mt-2 mb-3 flex flex-col items-center justify-center space-y-0.5 text-xs ">
      <div className="flex gap-1 tracking-wide opacity-100">
        <span>crypto + stocks</span>
        <span>search engine</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] sm:text-xs tracking-wide uppercase">
        <span className="font-medium">A Kanchan Sharma Production</span>
        <button
          onClick={() => router.push('/about')}
          className="p-1.5 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition"
          aria-label="About Financial Gurkha"
        >
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
