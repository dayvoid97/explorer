'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../lib/api'
import { removeTokens, isLoggedIn } from '../lib/auth'
import { ImagePlus } from 'lucide-react'
import {
  classifyExternalLink,
  extractYouTubeThumbnail,
  ExternalLinkInfo,
} from '../hooks/classifyExternalLinks'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function PostWinForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [externalLink, setExternalLink] = useState('')
  const [externalPreview, setExternalPreview] = useState<ExternalLinkInfo | null>(null)
  const [postType, setPostType] = useState<'dub' | 'intel'>('dub')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (externalLink.trim()) {
      const linkData = classifyExternalLink(externalLink.trim())
      const thumbnail =
        linkData.platform === 'youtube' && linkData.type === 'content'
          ? extractYouTubeThumbnail(externalLink.trim())
          : undefined
      setExternalPreview({
        ...linkData,
        url: externalLink.trim(),
        previewImage: thumbnail || undefined,
      })
    } else {
      setExternalPreview(null)
    }
  }, [externalLink])

  const handleAuthRedirect = (errMessage = 'Session expired. Please log in again.') => {
    setError(errMessage)
    removeTokens()
    router.push('/login')
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setMediaFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      if (!isLoggedIn()) throw new Error('You must be logged in to post.')

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
        const uploadUrlRes = await authFetch(
          `${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/get-upload-urls`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              count: mediaFiles.length,
              mimeTypes: mediaFiles.map((f) => f.type),
            }),
          }
        )

        const uploadUrlData = await uploadUrlRes.json()
        if (!uploadUrlRes.ok) throw new Error(uploadUrlData.message || 'Failed to get upload URLs.')

        const { signedUrls } = uploadUrlData

        await Promise.all(
          mediaFiles.map((file, i) =>
            fetch(signedUrls[i].url, {
              method: 'PUT',
              headers: { 'Content-Type': file.type },
              body: file,
            }).then((res) => {
              if (!res.ok) throw new Error(`Failed to upload ${file.name}`)
            })
          )
        )

        mediaUrls = signedUrls.map((u: any) => u.finalUrl)
        mimeTypes = mediaFiles.map((f) => f.type)
      }

      const res = await authFetch(`${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          paragraphs: paragraphArray,
          mediaUrls,
          mimeTypes,
          externalLink: externalPreview,
          type: postType,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to post your W.')
      }

      setTitle('')
      setContent('')
      setMediaFiles([])
      setExternalLink('')
      setExternalPreview(null)
      setPostType('dub')
      setSuccess(true)
    } catch (err: any) {
      console.error('❌ Post Win failed:', err)
      if (err.message.includes('authentication')) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 space-y-6 bg-white dark:bg-gray-900"
    >
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">POST YOUR DROP</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Start with a strong headline"
        required
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      <textarea
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about your dub or drop the intel..."
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      {/* Classification Toggle */}
      <div className="flex gap-4 items-center">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">TYPE:</span>
        <button
          type="button"
          onClick={() => setPostType('dub')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            postType === 'dub'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
          }`}
        >
          🎯 Dub
        </button>
        <button
          type="button"
          onClick={() => setPostType('intel')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            postType === 'intel'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
          }`}
        >
          🧠 Intel
        </button>
      </div>

      {/* External Link */}
      <input
        type="url"
        value={externalLink}
        onChange={(e) => setExternalLink(e.target.value)}
        placeholder="Paste a YouTube/TikTok link (optional)"
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      {externalPreview && (
        <div className="border p-4 rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <img
              src={`/icons/${externalPreview.platform}.svg`}
              alt={`${externalPreview.platform} icon`}
              className="w-6 h-6"
            />
            <a
              href={externalPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {externalPreview.type === 'channel'
                ? `Visit ${externalPreview.platform} Channel →`
                : `Watch Content →`}
            </a>
          </div>
          {externalPreview.previewImage && (
            <img
              src={externalPreview.previewImage}
              alt="Preview thumbnail"
              className="mt-4 rounded-lg shadow-md max-w-xs"
            />
          )}
        </div>
      )}

      {/* Media Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Media (Image, Video, Audio)
        </label>
        <div className="group relative w-fit">
          <label
            htmlFor="mediaUpload"
            className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform shadow-md"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-sm font-medium">Choose Media</span>
          </label>
          <input
            id="mediaUpload"
            type="file"
            accept="image/*,audio/*,video/*"
            multiple
            onChange={handleMediaChange}
            className="hidden"
          />
        </div>

        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {mediaFiles.map((file, i) => {
              const previewUrl = URL.createObjectURL(file)
              const fileType = file.type

              const removeFile = () => {
                setMediaFiles((prev) => prev.filter((_, index) => index !== i))
                URL.revokeObjectURL(previewUrl)
              }

              return (
                <div
                  key={i}
                  className="relative bg-white dark:bg-gray-900 border rounded-xl overflow-hidden shadow-md"
                >
                  {fileType.startsWith('image/') && (
                    <img src={previewUrl} alt="" className="w-full h-48 object-cover" />
                  )}
                  {fileType.startsWith('video/') && (
                    <video src={previewUrl} controls className="w-full h-48 object-cover" />
                  )}
                  {fileType.startsWith('audio/') && (
                    <div className="p-4">
                      <audio src={previewUrl} controls className="w-full" />
                    </div>
                  )}
                  <div className="px-4 py-2">
                    <p className="text-xs text-center truncate text-gray-700 dark:text-gray-300">
                      {file.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {success && (
        <p className="text-green-600 dark:text-green-400">🎉 Your drop has been posted!</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="self-center px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {submitting ? 'Submitting...' : '🚀 Drop It'}
      </button>
    </form>
  )
}
