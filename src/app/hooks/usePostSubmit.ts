// hooks/usePostSubmit.ts

import { useState, useCallback } from 'react'
import { authFetch } from '../lib/api'
import { getAccessToken } from '../lib/auth'
import { FormState, ProcessedLinkInfo } from './useQuickPostForm' // Import types

export interface UIState {
  submitting: boolean
  success: boolean
  error: string
}

const initialUIState: UIState = {
  submitting: false,
  success: false,
  error: '',
}

interface UploadResult {
  mediaUrls: string[]
  mimeTypes: string[]
}

// Helper to centralize the environment variable (best practice)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function usePostSubmit(
  formState: FormState,
  externalPreview: ProcessedLinkInfo | null,
  onSuccessfulPost: () => void
) {
  const [uiState, setUIState] = useState<UIState>(initialUIState)
  const updateUIState = useCallback(<K extends keyof UIState>(field: K, value: UIState[K]) => {
    setUIState((prev) => ({ ...prev, [field]: value }))
  }, [])

  // --- Media Upload Logic (Extracted) ---
  const uploadMedia = useCallback(async (files: File[]): Promise<UploadResult> => {
    if (files.length === 0) return { mediaUrls: [], mimeTypes: [] }

    // 1. Get Signed Upload URLs
    const uploadUrlRes = await authFetch(`${BASE_URL}/gurkha/wins/get-upload-urls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        count: files.length,
        mimeTypes: files.map((f) => f.type),
      }),
    })

    const uploadUrlData = await uploadUrlRes.json()
    if (!uploadUrlRes.ok) {
      throw new Error(uploadUrlData.message || 'Failed to prepare media upload.')
    }

    const { signedUrls } = uploadUrlData

    // 2. Upload Files using Signed URLs (Concurrent)
    await Promise.all(
      files.map((file, i) =>
        fetch(signedUrls[i].url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        }).then((res) => {
          if (!res.ok) throw new Error(`Failed to upload media file: ${file.name}`)
        })
      )
    )

    // 3. Return final URLs for the post payload
    return {
      mediaUrls: signedUrls.map((u: any) => u.finalUrl),
      mimeTypes: files.map((f) => f.type),
    }
  }, [])

  // --- Submission Handler ---
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      setUIState({ submitting: true, success: false, error: '' })

      try {
        const token = getAccessToken()
        if (!token) {
          throw new Error('Authentication required. Please log in to post.')
        }

        const paragraphArray = formState.content
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter((p) => p.length > 0)

        if (!formState.title.trim() || paragraphArray.length === 0) {
          throw new Error('Please ensure you have added both a title and description.')
        }

        // 1. Upload Media
        const { mediaUrls, mimeTypes } = await uploadMedia(formState.mediaFiles)

        // 2. Create the Post
        const res = await authFetch(`${BASE_URL}/gurkha/wins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formState.title,
            paragraphs: paragraphArray,
            mediaUrls,
            mimeTypes,
            externalLink: externalPreview,
            type: formState.postType,
            chronologyId: formState.chronologyId || null, // <--- ADD THIS
          }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Failed to create post on the server.')
        }

        // 3. Success
        updateUIState('success', true)
        setTimeout(() => onSuccessfulPost(), 1500) // Auto-close after success
      } catch (err: any) {
        console.error('❌ Post failed:', err)
        updateUIState('error', err.message || 'Something went wrong during posting.')
      } finally {
        updateUIState('submitting', false)
      }
    },
    [formState, externalPreview, uploadMedia, updateUIState, onSuccessfulPost]
  )

  return {
    uiState,
    handleSubmit,
  }
}
