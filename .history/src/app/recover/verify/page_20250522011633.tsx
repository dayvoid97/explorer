'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyCodePage() {
  const [email, setEmail] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('reset_email') || '' : ''
  )
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/reset/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // ✅ Save email in case it's needed in next step
      router.push('/recover/reset')
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter the 6-digit code"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Verify Code
        </button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  )
}
