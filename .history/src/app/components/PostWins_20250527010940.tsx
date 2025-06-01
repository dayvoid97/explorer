'use client'

import React, { useState } from 'react'
import { getToken } from '@/lib/auth'

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
        // Step 1: Get signed URL
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
            cardId: 'wins', // or something generic
          }),
        })

        const { url } = await uploadUrlRes.json()

        // Step 2: Upload to S3
        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': form.media.type },
          body: form.media,
        })

        mediaUrl = url.split('?')[0]
        mimeType = form.media.type
      }

      // Step 3: Post to /wins
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
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Post Your W 🏆</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alias</label>
        <input
          type="text"
          name="alias"
          value={form.alias}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Attach Media (optional)
        </label>
        <input type="file" accept="image/*,video/*,audio/*" onChange={handleMediaChange} />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Your W has been posted!</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Post W'}
      </button>
    </form>
  )
}
