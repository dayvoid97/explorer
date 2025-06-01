'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { storeToken } from '../lib/auth'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
import { trackEvent } from '../lib/analytics'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/gurkha/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Login failed')
      trackEvent('user_logged_in', { username: form.username })

      storeToken(data.token) // ✅ Save token in localStorage
      router.push('/profile') // ✅ Go to profile page
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Welcome Back</h1>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
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

      <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
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
