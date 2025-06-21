'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { getToken } from '../lib/auth'

interface Props {
  currentUrl?: string
  onUploadSuccess?: () => void
}

export default function ProfilePicture({ currentUrl, onUploadSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(currentUrl)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const token = getToken()
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

      // Step 1: Get signed upload URL from backend
      const uploadRes = await fetch(`${API_BASE}/gurkha/utils/media/get-upload-url`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          cardId: 'useravatar',
        }),
      })

      const { uploadUrl, fileUrl } = await uploadRes.json()
      const profilePicKey = fileUrl.split('.com/')[1]

      // Step 2: Upload image to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      // Step 3: Update profile document with new profilePicKey
      await fetch(`${API_BASE}/gurkha/profile/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicKey }),
      })

      // Step 4: Let parent refresh data
      if (onUploadSuccess) onUploadSuccess()
    } catch (err: any) {
      setError('❌ Failed to upload profile picture.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile picture"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm text-center p-2">
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
        className="text-sm text-blue-600 underline hover:text-blue-800"
      >
        {uploading
          ? 'Uploading...'
          : previewUrl
          ? 'Change Profile Picture'
          : 'Upload Profile Picture'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
