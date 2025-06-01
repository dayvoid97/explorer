'use client'

import React, { useState } from 'react'
import { getToken } from '../lib/auth'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function PostWinForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const token = getToken()
      if (!token) throw new Error('You must be logged in to post.')

      const paragraphArray = content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)

      if (!title.trim() || paragraphArray.length === 0) {
        throw new Error('Please fill out the title and story.')
      }

      let mediaUrls: string[] = []
      let mimeTypes: string[] = []

      if (mediaFiles.length > 0) {
        // Step 1: request signed URLs
        const uploadUrlRes = await fetch(
          `${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/get-upload-urls`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              count: mediaFiles.length,
              mimeTypes: mediaFiles.map((f) => f.type),
            }),
          }
        )

        if (!uploadUrlRes.ok) throw new Error('Failed to get upload URLs')
        const { signedUrls } = await uploadUrlRes.json()

        // Step 2: upload files to S3
        await Promise.all(
          mediaFiles.map((file, i) =>
            fetch(signedUrls[i].url, {
              method: 'PUT',
              headers: { 'Content-Type': file.type },
              body: file,
            })
          )
        )

        mediaUrls = signedUrls.map((u: any) => u.finalUrl)
        mimeTypes = mediaFiles.map((f) => f.type)
      }

      // Step 3: submit win to Firestore
      const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          paragraphs: paragraphArray,
          mediaUrls,
          mimeTypes,
        }),
      })

      if (!res.ok) throw new Error('Failed to post your W.')

      // Reset form
      setTitle('')
      setContent('')
      setMediaFiles([])
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-8 space-y-6 transition-all"
    >
      <h2 className="text-4xl font-bold">POST YOUR W</h2>

      <div className="space-y-2">
        <input
          type="text"
          value={title}
          placeholder="EVERY W BEGINS WITH A W TITLE
          "
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="PRESS YOUR W STORY."
          className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium ">Upload Images (optional)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMediaChange}
          className="block w-full text-sm "
        />
        {mediaFiles.length > 0 && (
          <ul className="list-disc pl-5 text-sm ">
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
        className="self-center px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 transition duration-200 shadow-lg"
      >
        {submitting ? 'Submitting...' : '🚀 POST IT '}
      </button>
    </form>
  )
}
