'use client'

import React, { useState } from 'react'
import { getToken } from '../lib/auth'

export default function PostWinForm() {
  const [form, setForm] = useState({
    alias: '',
    title: '',
    description: '',
    media: null as File | null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({ ...prev, media: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      let mediaUrl = null
      let mimeType = null

      if (form.media) {
        const token = getToken()
        const uploadUrlRes = await fetch('/api/file/get-upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: form.media.name,
            mimeType: form.media.type,
            cardId: 'wins',
          }),
        })

        const { url } = await uploadUrlRes.json()

        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': form.media.type },
          body: form.media,
        })

        mediaUrl = url.split('?')[0]
        mimeType = form.media.type
      }

      const token = getToken()
      const res = await fetch('/api/wins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          alias: form.alias,
          title: form.title,
          description: form.description,
          mediaUrl,
          mimeType,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setSuccess(true)
      setForm({ alias: '', title: '', description: '', media: null })
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 space-y-6 transition-colors"
    >
      <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">A WIN IS A WIN</h2>
      <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">Post Your W 🏆</h2>

      <p className="text-gray-600 dark:text-gray-400">
        Share a win — no matter how big or small. You're doing great. 👊
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Alias
        </label>
        <input
          type="text"
          name="alias"
          value={form.alias}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Attach Media (optional)
        </label>
        <label className="cursor-pointer inline-block px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition">
          Choose File
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleMediaChange}
            className="hidden"
          />
        </label>
        {form.media && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selected: {form.media.name}
          </p>
        )}
      </div>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="text-green-600 dark:text-green-400">Your W has been posted!</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : '🚀 Post Your W'}
      </button>
    </form>
  )
}
