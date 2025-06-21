'use client'

import { useRouter } from 'next/navigation'

export default function MessagesCard() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/inbox')}
      className="cursor-pointer p-4 border rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">💬</span>
        <div>
          <p className="text-sm font-medium">Messages</p>
          <p className="text-xs text-gray-500">See who messaged you</p>
        </div>
      </div>
    </div>
  )
}
