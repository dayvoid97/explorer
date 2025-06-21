'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getToken } from '@/app/lib/auth'

export default function MessagesCard() {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      const token = getToken()
      if (!token) return

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      const unread = data.filter((d: any) => d.isUnread).length
      setUnreadCount(unread)
    }

    fetchUnread()
  }, [])

  return (
    <div
      onClick={() => router.push('/inbox')}
      className="relative cursor-pointer p-4 border rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">💬</span>
        <div>
          <p className="text-sm font-medium">Messages</p>
          <p className="text-xs text-gray-500">See who messaged you</p>
        </div>
        {unreadCount > 0 && (
          <span className="ml-2 text-white bg-red-500 rounded-full px-2 py-0.5 text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  )
}
