// app/signup/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '../lib/analytics'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    experience: '',
  })
  const [step, setStep] = useState<'signup' | 'verify'>('signup')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    trackEvent('signup_started', { username: form.username })
    const usernamePattern = /^[a-zA-Z0-9]+$/
    if (!usernamePattern.test(form.username)) {
      setError('Username must contain only letters and numbers.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/gurkha/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sign up failed')

      setStep('verify')
      trackEvent('signup_email_sent', { username: form.username })
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${API_BASE}/gurkha/auth/verify-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code, mode: 'verify' }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      trackEvent('signup_verified', { username: form.username })

      router.push('/login')
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {step === 'signup' ? 'Create Your FINANCIAL GURKHA Account' : 'Verify Your Email'}
      </h1>

      {step === 'signup' ? (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username (letters and numbers only)"
            pattern="[a-zA-Z0-9]+"
            title="Username must be letters and numbers only"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Briefly describe your market experience"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit verification code"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Verify Email
          </button>
        </form>
      )}

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {step === 'signup' && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Log in
          </a>
        </p>
      )}
    </main>
  )
}
