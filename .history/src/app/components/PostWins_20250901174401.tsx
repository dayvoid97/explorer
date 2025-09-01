'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../lib/api'
import { removeTokens, isLoggedIn, getUsernameFromToken, getAccessToken } from '../lib/auth'
import { ImagePlus, User } from 'lucide-react'
import {
  classifyExternalLink,
  extractYouTubeThumbnail,
  ExternalLinkInfo,
} from '../hooks/classifyExternalLinks'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type PostType = 'dub' | 'intel'

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

interface UserInfo {
  username: string
  displayName?: string
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

export default function PostWinForm() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [uiState, setUIState] = useState<UIState>(initialUIState)
  const [externalPreview, setExternalPreview] = useState<ExternalLinkInfo | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

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

  // Get user info from token
  useEffect(() => {
    if (isLoggedIn()) {
      const token = getAccessToken()
      const username = getUsernameFromToken(token)
      if (username) {
        setUserInfo({ username })
      }
    }
  }, [])

  const handleAuthRedirect = useCallback(
    (errMessage = 'Session expired. Please log in again.') => {
      setUIState((prev) => ({ ...prev, error: errMessage }))
      removeTokens()
      router.push('/login')
    },
    [router]
  )

  const updateFormState = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateUIState = useCallback(<K extends keyof UIState>(field: K, value: UIState[K]) => {
    setUIState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleMediaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files?.length) {
        const newFiles = Array.from(files)
        updateFormState('mediaFiles', [...formState.mediaFiles, ...newFiles])
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

  const resetForm = useCallback(() => {
    // Clean up object URLs
    formState.mediaFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      URL.revokeObjectURL(url)
    })

    setFormState(initialFormState)
    setExternalPreview(null)
  }, [formState.mediaFiles])

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

    // Upload all files in parallel
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
          throw new Error('Please fill out the title and story.')
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
          throw new Error(errorData.message || 'Failed to post your W.')
        }

        resetForm()
        updateUIState('success', true)
      } catch (err: any) {
        console.error('❌ Post Win failed:', err)
        if (err.message.includes('authentication')) {
          handleAuthRedirect(err.message)
        } else {
          updateUIState('error', err.message || 'Something went wrong.')
        }
      } finally {
        updateUIState('submitting', false)
      }
    },
    [formState, externalPreview, uploadMedia, resetForm, updateUIState, handleAuthRedirect]
  )

  const PostTypeButton = useCallback(
    ({
      type,
      emoji,
      label,
      isActive,
    }: {
      type: PostType
      emoji: string
      label: string
      isActive: boolean
    }) => (
      <button
        type="button"
        onClick={() => updateFormState('postType', type)}
        className={`px-4 py-1 rounded-full text-sm font-medium transition ${
          isActive
            ? type === 'dub'
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
        }`}
      >
        {emoji} {label}
      </button>
    ),
    [updateFormState]
  )

  const MediaPreview = useCallback(
    ({ file, index }: { file: File; index: number }) => {
      const previewUrl = useMemo(() => URL.createObjectURL(file), [file])
      const fileType = file.type

      return (
        <div className="relative bg-white dark:bg-gray-900 border rounded-xl overflow-hidden shadow-md">
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
            onClick={() => removeMediaFile(index)}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-full"
          >
            ✕
          </button>
        </div>
      )
    },
    [removeMediaFile]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className=" rounded-2xl shadow-lg p-8 space-y-6 bg-white dark:bg-gray-900"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">POST YOUR DROP</h2>

        {/* User Info Display */}
        {isLoggedIn() && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {uiState.submitting ? (
                'Loading...'
              ) : userInfo ? (
                <>
                  Posting as{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {userInfo.displayName || userInfo.username}
                  </span>
                </>
              ) : (
                'Posting as guest'
              )}
            </span>
          </div>
        )}
      </div>

      <input
        type="text"
        value={formState.title}
        onChange={(e) => updateFormState('title', e.target.value)}
        placeholder="Start with a strong headline"
        required
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      <textarea
        rows={8}
        value={formState.content}
        onChange={(e) => updateFormState('content', e.target.value)}
        placeholder="Write about your dub or drop the intel..."
        className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-gray-200"
      />

      {/* Post Type Toggle */}
      <div className="flex gap-4 items-center">
        <PostTypeButton type="dub" emoji="🎯" label="DUB" isActive={formState.postType === 'dub'} />
        <PostTypeButton
          type="intel"
          emoji="🤪"
          label="Dilly Dally"
          isActive={formState.postType === 'intel'}
        />
      </div>

      {/* External Link */}
      <input
        type="url"
        value={formState.externalLink}
        onChange={(e) => updateFormState('externalLink', e.target.value)}
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

        {formState.mediaFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {formState.mediaFiles.map((file, i) => (
              <MediaPreview key={`${file.name}-${i}`} file={file} index={i} />
            ))}
          </div>
        )}
      </div>

      {uiState.error && <p className="text-red-600 dark:text-red-400">{uiState.error}</p>}
      {uiState.success && (
        <p className="text-green-600 dark:text-green-400">🎉 Your drop has been posted!</p>
      )}

      <button
        type="submit"
        disabled={uiState.submitting}
        className="self-center px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uiState.submitting ? 'Submitting...' : '🚀 Drop It'}
      </button>
    </form>
  )
}
