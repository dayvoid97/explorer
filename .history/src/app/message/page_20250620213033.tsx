'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getToken, getUsernameFromToken } from '@/app/lib/auth'

export default function MessagePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recipient = searchParams.get('to') || ''
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [sender, setSender] = useState('')

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (!t) {
      router.push('/login')
    } else {
      const user = getUsernameFromToken(t)
      setSender(user)
    }
  }, [])

  const handleSend = async () => {
    if (!token || !message.trim()) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipient,
        text: message.trim(),
      }),
    })

    if (res.ok) {
      setSent(true)
      setMessage('')
    } else {
      alert('Failed to send message')
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Send a Message</h1>
      <p className="text-sm text-gray-600 mb-6">
        Messaging <span className="font-bold text-black">@{recipient}</span>
      </p>

      <textarea
        className="w-full p-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={6}
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {sent && <div className="mt-4 text-green-600 font-medium">✅ Message sent successfully!</div>}
    </div>
  )
}
