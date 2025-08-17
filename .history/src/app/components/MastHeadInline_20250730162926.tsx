// components/MastheadInline.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function MastheadInline() {
  const router = useRouter()

  return (
    <div className="hidden md:flex flex-col text-center items-center justify-center  w-full">
      <div className="space-x-3 tracking-wide">
        <span>crypto + stocks</span>
        <span>search engine</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p className="text-bold tracking-widest uppercase">A Kanchan Sharma Production</p>
        <button
          onClick={() => router.push('/about')}
          className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition"
          aria-label="About Financial Gurkha"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
