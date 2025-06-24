'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image' // Keep Image for Next.js optimization
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens for handling auth errors
import { authFetch } from '../lib/api' // Make sure this path is correct
import { removeTokens } from '../lib/auth' // Add removeTokens for handling auth errors
import { useRouter } from 'next/navigation' // For redirection

interface Props {
  currentUrl?: string
  onUploadSuccess?: () => void
}

export default function ProfilePicture({ currentUrl, onUploadSuccess }: Props) {
  const router = useRouter() // Initialize useRouter
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(currentUrl)

  useEffect(() => {
    setPreviewUrl(currentUrl)
  }, [currentUrl])

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('') // Clear previous errors

    try {
      // REMOVED: const token = getToken(); - authFetch handles this internally
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

      // Step 1: Get signed upload URL (uses authFetch)
      // CHANGED: Use authFetch for this authenticated call
      const signedUrlRes = await authFetch(`${API_BASE}/gurkha/utils/media/get-upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          cardId: 'useravatar', // Assuming 'useravatar' is a valid ID for profile pictures
        }),
      })

      const signedUrlData = await signedUrlRes.json()
      if (!signedUrlRes.ok) {
        throw new Error(
          signedUrlData.message || signedUrlData.error || 'Failed to get signed URL for upload.'
        )
      }
      const { uploadUrl, fileUrl } = signedUrlData as { uploadUrl: string; fileUrl: string }
      const profilePicKey = fileUrl.split('.com/')[1] // Extract key from the returned fileUrl

      // Step 2: Upload to S3 (Direct fetch, as it's to S3, not your backend API)
      const s3UploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!s3UploadRes.ok) {
        const s3ErrorText = await s3UploadRes.text() // S3 errors might be in text/XML
        throw new Error(`Failed to upload to S3: ${s3UploadRes.status} - ${s3ErrorText}`)
      }

      // Step 3: Update profile document (uses authFetch)
      // CHANGED: Use authFetch for this authenticated call
      const updateProfileRes = await authFetch(`${API_BASE}/gurkha/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify({ profilePicKey }),
      })

      if (!updateProfileRes.ok) {
        const updateErrorData = await updateProfileRes.json()
        throw new Error(
          updateErrorData.message ||
            updateErrorData.error ||
            'Failed to update profile picture URL in database.'
        )
      }

      // ✅ Step 4: Get fresh signed URL for updated UI (uses authFetch)
      // This is to get the latest signed URL for the newly updated profile picture
      // CHANGED: Use authFetch for this authenticated call
      const refreshProfileRes = await authFetch(`${API_BASE}/gurkha/profile`, {
        headers: {
          /* authFetch adds Authorization header */
        },
      })

      const updatedProfileData = await refreshProfileRes.json()
      if (!refreshProfileRes.ok) {
        throw new Error(
          updatedProfileData.message ||
            updatedProfileData.error ||
            'Failed to refresh profile data after upload.'
        )
      }

      if (updatedProfileData.profilePicUrl) {
        setPreviewUrl(updatedProfileData.profilePicUrl)
      }

      // Let parent (ProfilePage) also update if needed
      if (onUploadSuccess) onUploadSuccess()
    } catch (err: any) {
      console.error('❌ Profile picture upload failed:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || '❌ Failed to upload profile picture.')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
        {' '}
        {/* Dark mode border */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile picture"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm text-center p-2">
            {' '}
            {/* Dark mode bg/text */}
            No Image
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {uploading
          ? 'Uploading...'
          : previewUrl
          ? 'Change Profile Picture'
          : 'Upload Profile Picture'}
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}{' '}
      {/* Dark mode text */}
    </div>
  )
}
