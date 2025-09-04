'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireResetEmail } from '@/app/hooks/requireResetEmail'

export default function ResetPasswordPage() {
  useRequireResetEmail()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/reset/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword: password }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      localStorage.removeItem('reset_email')
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h1>
      <p className="text-center text-sm text-gray-600 mb-6">
        Enter the <strong>email you used to receive the verification code</strong> and your new
        password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email used to verify"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          Reset Password
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </main>
  )
}
