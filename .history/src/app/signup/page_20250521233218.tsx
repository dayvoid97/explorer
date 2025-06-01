'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { storeToken } from '../lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    experience: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${API_BASE}/api/gurkha/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sign up failed')

      storeToken(data.token)
      router.push('/')
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Create Your Explorer Account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
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

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
      </p>
    </main>
  )
}
