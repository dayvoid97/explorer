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
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Real-time username validation
    if (name === 'username') {
      const usernamePattern = /^[a-zA-Z0-9]+$/
      if (value && !usernamePattern.test(value)) {
        setFieldErrors((prev) => ({ ...prev, username: 'Only letters and numbers allowed' }))
      }
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!form.username) {
      errors.username = 'Please enter a username'
    } else if (!/^[a-zA-Z0-9]+$/.test(form.username)) {
      errors.username = 'Username can only contain letters and numbers'
    }

    if (!form.email) {
      errors.email = 'Please enter your email address'
    }

    if (!form.password) {
      errors.password = 'Please create a password'
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    trackEvent('signup_started', { username: form.username })

    try {
      const res = await fetch(`${API_BASE}/gurkha/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sign up failed')

      trackEvent('signup_email_sent', { username: form.username })
      setSuccess(
        'Great! Your account has been created. We sent a confirmation email to your inbox. You can now log in to your account.'
      )
      setTimeout(() => {
        router.push('/login')
      }, 4000) // Slightly longer delay for reading
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
    <main className="max-w-lg mx-auto py-12 px-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-3 text-gray-800 leading-tight">
          {step === 'signup' ? 'Create Your Financial Gurkha Account' : 'Verify Your Email'}
        </h1>
        {step === 'signup' && (
          <p className="text-gray-600 text-base">
            Join thousands of investors who trust Financial Gurkha for market insights
          </p>
        )}
      </div>

      {step === 'signup' ? (
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Choose a Username *
            </label>
            <p className="text-sm text-gray-500 mb-2">
              This will be your unique identifier (example: john123 or investor2024)
            </p>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              aria-describedby="username-help username-error"
              className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p id="username-help" className="text-sm text-gray-500 mt-1">
              Letters and numbers only (no spaces or special characters)
            </p>
            {fieldErrors.username && (
              <p id="username-error" className="text-red-600 text-sm mt-1" role="alert">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <p className="text-sm text-gray-500 mb-2">
              We'll send important account information here
            </p>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              aria-describedby="email-error"
              className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Create a Password *
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordRequirements(true)}
              placeholder="Create a secure password"
              required
              aria-describedby="password-requirements password-error"
              className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showPasswordRequirements && (
              <div id="password-requirements" className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Password requirements:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className={form.password.length >= 8 ? 'text-green-600' : ''}>
                    ✓ At least 8 characters long
                  </li>
                  <li>✓ Mix of letters and numbers recommended</li>
                </ul>
              </div>
            )}
            {fieldErrors.password && (
              <p id="password-error" className="text-red-600 text-sm mt-1" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Experience Field */}
          <div>
            <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
              Investment Experience (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Help us understand your background (example: "New to investing" or "5 years trading
              stocks")
            </p>
            <textarea
              id="experience"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Tell us about your investment experience..."
              rows={3}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 text-lg font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-200"
          >
            Create My Account
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-gray-600">
              We sent a 6-digit code to <strong>{form.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">Check your inbox and spam folder</p>
          </div>

          <div>
            <label
              htmlFor="verification-code"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Verification Code *
            </label>
            <input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 text-lg font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-200"
          >
            Verify My Email
          </button>
        </form>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 font-medium">There was a problem:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
          <p className="text-green-700 font-medium">Success!</p>
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {step === 'signup' && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 underline hover:text-blue-800 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      )}
    </main>
  )
}
