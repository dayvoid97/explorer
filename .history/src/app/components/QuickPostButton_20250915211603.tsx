'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { authFetch } from '../lib/api'
import { isLoggedIn, getUsernameFromToken, getAccessToken } from '../lib/auth'
import { X, ImagePlus, Link2, Send } from 'lucide-react'
import {
  classifyExternalLink,
  extractYouTubeThumbnail,
  ExternalLinkInfo,
} from '../hooks/classifyExternalLinks'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type PostType = 'dub' | 'intel'

interface QuickPostModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormState {
  title: string
  content: string
  mediaFiles: File[]
  externalLink: string
  postType: PostType
}

interface UIState {
  submitting: boolean
  success: boolean
  error: string
}

const initialFormState: FormState = {
  title: '',
  content: '',
  mediaFiles: [],
  externalLink: '',
  postType: 'dub',
}

const initialUIState: UIState = {
  submitting: false,
  success: false,
  error: '',
}

export function QuickPostModal({ isOpen, onClose }: QuickPostModalProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [uiState, setUIState] = useState<UIState>(initialUIState)
  const [externalPreview, setExternalPreview] = useState<ExternalLinkInfo | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Memoized external link processing
  const processedExternalLink = useMemo(() => {
    if (!formState.externalLink.trim()) return null

    const linkData = classifyExternalLink(formState.externalLink.trim())
    const thumbnail =
      linkData.platform === 'youtube' && linkData.type === 'content'
        ? extractYouTubeThumbnail(formState.externalLink.trim())
        : undefined

    return {
      ...linkData,
      url: formState.externalLink.trim(),
      previewImage: thumbnail || undefined,
    }
  }, [formState.externalLink])

  useEffect(() => {
    setExternalPreview(processedExternalLink)
  }, [processedExternalLink])

  const updateFormState = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateUIState = useCallback(<K extends keyof UIState>(field: K, value: UIState[K]) => {
    setUIState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    formState.mediaFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      URL.revokeObjectURL(url)
    })
    setFormState(initialFormState)
    setExternalPreview(null)
    setUIState(initialUIState)
    setShowAdvanced(false)
  }, [formState.mediaFiles])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const handleMediaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files?.length) {
        const newFiles = Array.from(files)
        updateFormState('mediaFiles', [...formState.mediaFiles, ...newFiles])
        setShowAdvanced(true) // Show advanced options when media is added
      }
    },
    [formState.mediaFiles, updateFormState]
  )

  const removeMediaFile = useCallback(
    (index: number) => {
      const fileToRemove = formState.mediaFiles[index]
      if (fileToRemove) {
        const previewUrl = URL.createObjectURL(fileToRemove)
        URL.revokeObjectURL(previewUrl)
      }
      updateFormState(
        'mediaFiles',
        formState.mediaFiles.filter((_, i) => i !== index)
      )
    },
    [formState.mediaFiles, updateFormState]
  )

  const uploadMedia = useCallback(async (files: File[]) => {
    if (files.length === 0) return { mediaUrls: [], mimeTypes: [] }

    const uploadUrlRes = await authFetch(
      `${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/get-upload-urls`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: files.length,
          mimeTypes: files.map((f) => f.type),
        }),
      }
    )

    const uploadUrlData = await uploadUrlRes.json()
    if (!uploadUrlRes.ok) {
      throw new Error(uploadUrlData.message || 'Failed to get upload URLs.')
    }

    const { signedUrls } = uploadUrlData

    await Promise.all(
      files.map((file, i) =>
        fetch(signedUrls[i].url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        }).then((res) => {
          if (!res.ok) throw new Error(`Failed to upload ${file.name}`)
        })
      )
    )

    return {
      mediaUrls: signedUrls.map((u: any) => u.finalUrl),
      mimeTypes: files.map((f) => f.type),
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      setUIState({ submitting: true, success: false, error: '' })

      try {
        if (!isLoggedIn()) {
          throw new Error('You must be logged in to post.')
        }

        const paragraphArray = formState.content
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter((p) => p.length > 0)

        if (!formState.title.trim() || paragraphArray.length === 0) {
          throw new Error('Please add a title and content.')
        }

        const { mediaUrls, mimeTypes } = await uploadMedia(formState.mediaFiles)

        const res = await authFetch(`${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formState.title,
            paragraphs: paragraphArray,
            mediaUrls,
            mimeTypes,
            externalLink: externalPreview,
            type: formState.postType,
          }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Failed to post.')
        }

        updateUIState('success', true)
        setTimeout(() => handleClose(), 1500) // Auto-close after success
      } catch (err: any) {
        console.error('❌ Post failed:', err)
        updateUIState('error', err.message || 'Something went wrong.')
      } finally {
        updateUIState('submitting', false)
      }
    },
    [formState, externalPreview, uploadMedia, updateUIState, handleClose]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold ">POST A QUICK DUB</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={formState.title}
            onChange={(e) => updateFormState('title', e.target.value)}
            placeholder="Title your dub"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Content */}
          <textarea
            rows={4}
            value={formState.content}
            onChange={(e) => updateFormState('content', e.target.value)}
            placeholder="Add a description"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <label htmlFor="quickMedia" className="cursor-pointer">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ImagePlus className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <input
                id="quickMedia"
                type="file"
                accept="image/*,audio/*,video/*"
                multiple
                onChange={handleMediaChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Link2 className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Link</span>
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Post Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateFormState('postType', 'dub')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    formState.postType === 'dub'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  🎯 DUB
                </button>
                <button
                  type="button"
                  onClick={() => updateFormState('postType', 'intel')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    formState.postType === 'intel'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  🤪 Dilly Dally
                </button>
              </div>

              {/* External Link */}
              <input
                type="url"
                value={formState.externalLink}
                onChange={(e) => updateFormState('externalLink', e.target.value)}
                placeholder="Add a link (YouTube, TikTok, etc.)"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* External Link Preview */}
              {externalPreview && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src={`/icons/${externalPreview.platform}.svg`}
                      alt=""
                      className="w-4 h-4"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {externalPreview.platform} {externalPreview.type}
                    </span>
                  </div>
                  {externalPreview.previewImage && (
                    <img
                      src={externalPreview.previewImage}
                      alt=""
                      className="mt-2 rounded max-w-full h-20 object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Media Previews */}
          {formState.mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {formState.mediaFiles.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-full h-20 object-cover"
                      />
                    )}
                    {file.type.startsWith('video/') && (
                      <video src={URL.createObjectURL(file)} className="w-full h-20 object-cover" />
                    )}
                    {file.type.startsWith('audio/') && (
                      <div className="p-3 text-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">🎵 Audio</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMediaFile(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error/Success Messages */}
          {uiState.error && (
            <p className="text-red-600 dark:text-red-400 text-sm">{uiState.error}</p>
          )}
          {uiState.success && (
            <p className="text-green-600 dark:text-green-400 text-sm">🎉 Dubbed successfully!</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uiState.submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {uiState.submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Floating Action Button Component
export function QuickPostButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  useEffect(() => {
    setUserLoggedIn(isLoggedIn())
  }, [])

  if (!userLoggedIn) return null

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 hover:scale-105"
        aria-label="Create new post"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <QuickPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
