'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// UPDATED IMPORT: Use storeTokens (plural)
import { storeTokens } from '../lib/auth' // Make sure this path is correct
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
import { trackEvent } from '../lib/analytics' // Assuming this is correct

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors
    try {
      const res = await fetch(`${API_BASE}/gurkha/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle specific backend error messages if needed
        throw new Error(data.message || data.error || 'Login failed')
      }

      trackEvent('user_logged_in', { username: form.username })

      // CHANGED: Store BOTH accessToken and refreshToken returned by the backend
      // The backend login endpoint should now return { accessToken, refreshToken }
      if (data.accessToken && data.refreshToken) {
        storeTokens(data.accessToken, data.refreshToken, data.notificationToken)
        router.push('/profile') // Redirect to profile page on successful login
      } else {
        throw new Error('Login successful, but tokens were not received from the server.')
      }
    } catch (err: any) {
      console.error('Frontend login error:', err)
      setError(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
      <h1 className="text-3xl font-bold mb-6 text-center">Let us get you in</h1>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Enter your username"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>

      <div className="mt-10 text-center text-xl space-y-2">
        <a href="/signup" className="text-blue-600 underline">
          Don't have an account? Sign up
        </a>
        <div>
          <a href="/recover" className="text-gray-500 underline">
            Trouble signing in?
          </a>
        </div>
      </div>
    </main>
  )
}
