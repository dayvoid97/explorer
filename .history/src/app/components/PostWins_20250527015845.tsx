'use client'

import React, { useState, useEffect } from 'react'
import { getToken } from '../lib/auth'

export default function PostWinForm() {
  const [title, setTitle] = useState('')
  const [paragraphs, setParagraphs] = useState([''])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Add new paragraph input
  const addParagraph = () => setParagraphs((prev) => [...prev, ''])

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...paragraphs]
    updated[index] = value
    setParagraphs(updated)
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(false)
    setError('')

    try {
      const token = getToken()
      if (!token) throw new Error('You must be logged in to post.')

      let mediaUrls: string[] = []
      let mimeTypes: string[] = []

      // Step 1: Upload all media
      for (const file of mediaFiles) {
        const uploadRes = await fetch('/api/file/get-upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type,
            cardId: 'wins',
          }),
        })

        const { url } = await uploadRes.json()
        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })

        mediaUrls.push(url.split('?')[0])
        mimeTypes.push(file.type)
      }

      // Step 2: Submit win
      const res = await fetch('/api/wins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          paragraphs: paragraphs.filter((p) => p.trim() !== ''),
          mediaUrls,
          mimeTypes,
        }),
      })

      if (!res.ok) throw new Error('Failed to post your W')

      setSuccess(true)
      setTitle('')
      setParagraphs([''])
      setMediaFiles([])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-8 space-y-6 transition-all"
    >
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Post Your W 🏆</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {paragraphs.map((text, idx) => (
        <div key={idx} className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paragraph {idx + 1}
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => handleParagraphChange(idx, e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addParagraph}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ➕ Add Paragraph
      </button>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Images (max 5)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMediaChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400"
        />
        {mediaFiles.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
            {mediaFiles.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="text-green-600 dark:text-green-400">🎉 Your W was posted!</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : '🚀 Post W'}
      </button>
    </form>
  )
}
