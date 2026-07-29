'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import InboxPreview from '../components/InboxPreview'

export default function InboxPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/profile"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back to profile"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Your Conversation</h1>
      </div>

      <InboxPreview />
    </main>
  )
}
