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
      setExternalLink('')
      setExternalPreview(null)
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
      className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 space-y-6 bg-white dark:bg-gray-900"
    >
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">POST YOUR DUBS</h2>

      <input
        type="text"
        value={title}
        placeholder="EVERY W BEGINS WITH A W TITLE"
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      <textarea
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Explain your W story for the CHAT."
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      <input
        type="url"
        value={externalLink}
        onChange={(e) => setExternalLink(e.target.value)}
        placeholder="Add a YouTube/TikTok/External link (optional)"
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

      {/* Media uploader & preview logic stays unchanged... */}
      {/* [Omitted for brevity – keep as is from your last message] */}

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="text-green-600 dark:text-green-400">🎉 Your W was posted!</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-center px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {submitting ? 'Submitting...' : '🚀 POST IT'}
      </button>
    </form>
  )
}
