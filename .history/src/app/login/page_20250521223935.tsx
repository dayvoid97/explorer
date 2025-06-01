'use client'

import React, { useState } from 'react'
import { getToken } from '../lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage(): JSX.Element {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to backend
    console.log('Login data:', form)
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Welcome Back</h1>

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
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        <a href="/recover" className="text-blue-500 hover:underline">
          Trouble signing in?
        </a>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <a href="/signup" className="text-blue-600 underline">
          Create one
        </a>
      </p>
    </main>
  )
}
