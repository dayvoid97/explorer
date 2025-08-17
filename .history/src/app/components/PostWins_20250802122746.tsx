'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
import { authFetch } from '../lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '../lib/auth' // isLoggedIn for initial check
import { ImagePlus } from 'lucide-react'
import {
  classifyExternalLink,
  extractYouTubeThumbnail,
  ExternalLinkInfo,
} from '../hooks/classifyExternalLinks'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function PostWinForm() {
  const router = useRouter() // Initialize useRouter
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [externalLink, setExternalLink] = useState('')
  const [externalPreview, setExternalPreview] = useState<ExternalLinkInfo | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (externalLink.trim()) {
      const linkData = classifyExternalLink(externalLink.trim())
      if (linkData.platform === 'youtube' && linkData.type === 'content') {
        const thumbnail = extractYouTubeThumbnail(externalLink.trim())
        setExternalPreview({ ...linkData, url: externalLink.trim(), previewImage: thumbnail })
      } else {
        setExternalPreview({ ...linkData, url: externalLink.trim() })
      }
    } else {
      setExternalPreview(null)
    }
  }, [externalLink])

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('') // Clear previous errors
    setSuccess(false)

    try {
      // Check if user is logged in before attempting authenticated fetch
      if (!isLoggedIn()) {
        throw new Error('You must be logged in to post a win.') // AuthFetch will also catch this
      }

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
        // Step 1: Request signed URLs (uses authFetch)
        // CHANGED: Use authFetch for this authenticated call
        const uploadUrlRes = await authFetch(
          `${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/get-upload-urls`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // authFetch adds Authorization header
            body: JSON.stringify({
              count: mediaFiles.length,
              mimeTypes: mediaFiles.map((f) => f.type),
            }),
          }
        )

        const uploadUrlData = await uploadUrlRes.json()
        if (!uploadUrlRes.ok) {
          throw new Error(
            uploadUrlData.message || uploadUrlData.error || 'Failed to get upload URLs.'
          )
        }
        const { signedUrls } = uploadUrlData

        // Step 2: Upload files to S3 (Direct fetch, as it's to S3, not your backend API)
        await Promise.all(
          mediaFiles.map((file, i) =>
            fetch(signedUrls[i].url, {
              method: 'PUT',
              headers: { 'Content-Type': file.type },
              body: file,
            }).then((s3Res) => {
              if (!s3Res.ok) {
                // S3 upload failed for a specific file
                return s3Res
                  .text()
                  .then((text) =>
                    Promise.reject(
                      new Error(`S3 upload failed for ${file.name}: ${s3Res.status} - ${text}`)
                    )
                  )
              }
              return s3Res // Return the response for Promise.all
            })
          )
        )

        mediaUrls = signedUrls.map((u: any) => u.finalUrl)
        mimeTypes = mediaFiles.map((f) => f.type)
      }

      // Step 3: Submit win to Firestore (uses authFetch)
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify({
          title,
          paragraphs: paragraphArray,
          mediaUrls,
          mimeTypes,
          externalLink: externalPreview,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || errorData.error || 'Failed to post your W.')
      }

      // Reset form on success
      setTitle('')
      setContent('')
      setMediaFiles([])
      setSuccess(true)
    } catch (err: any) {
      console.error('❌ Post Win failed:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
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
      // Add dark mode styles for form container
      className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 space-y-6 transition-all bg-white dark:bg-gray-900"
    >
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">POST YOUR DUBS </h2>{' '}
      {/* Dark mode text */}
      <div className="space-y-2">
        <input
          type="text"
          value={title}
          placeholder="EVERY W BEGINS WITH A W TITLE"
          onChange={(e) => setTitle(e.target.value)}
          required
          // Dark mode styles for input
          className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Explain your W story for the CHAT."
          // Dark mode styles for textarea
          className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Media (Image, Video, Audio)
        </label>

        <div className="group relative w-fit">
          <label
            htmlFor="mediaUpload"
            // Dark mode styles for media upload button
            className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform shadow-md"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-sm font-medium">Choose Media</span>
          </label>
          <input
            id="mediaUpload"
            type="file"
            accept="image/*,audio/*,video/*" // Ensure this accepts all relevant types
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
                // Clean up Blob URL when file is removed
                URL.revokeObjectURL(previewUrl)
              }

              return (
                <div
                  key={i}
                  // Add dark mode styles for media preview card
                  className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md transition hover:shadow-lg"
                >
                  {fileType.startsWith('image/') && (
                    <img
                      src={previewUrl}
                      alt={`preview-${i}`}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  {fileType.startsWith('video/') && (
                    <video src={previewUrl} controls className="w-full h-48 object-cover" />
                  )}

                  {fileType.startsWith('audio/') && (
                    <div className="p-4">
                      <audio src={previewUrl} controls className="w-full">
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}

                  <div className="px-4 py-2">
                    <p className="text-xs text-center text-gray-700 dark:text-gray-300 truncate">
                      {file.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    // Dark mode styles for remove button
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>} {/* Dark mode text */}
      {success && <p className="text-green-600 dark:text-green-400">🎉 Your W was posted!</p>}{' '}
      {/* Dark mode text */}
      <button
        type="submit"
        disabled={submitting}
        // Dark mode styles for submit button
        className="self-center px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-200 shadow-lg"
      >
        {submitting ? 'Submitting...' : '🚀 POST IT '}
      </button>
    </form>
  )
}
