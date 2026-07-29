// hooks/useQuickPostForm.ts

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  classifyExternalLink,
  extractYouTubeThumbnail,
  ExternalLinkInfo,
} from '../hooks/classifyExternalLinks'

type PostType = 'dub' | 'intel'

export interface FormState {
  title: string
  content: string
  mediaFiles: File[]
  externalLink: string
  postType: PostType
  chronologyId?: string
}

export interface ProcessedLinkInfo extends ExternalLinkInfo {
  url: string
  previewImage?: string
}

const initialFormState: FormState = {
  title: '',
  content: '',
  mediaFiles: [],
  externalLink: '',
  postType: 'dub',
  chronologyId: '',
}

export function useQuickPostForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // --- State Updaters ---

  const updateFormState = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  // --- Memoized External Link Processing (Optimized) ---
  let thumbnail: string | undefined // Accepts string or undefined

  const processedExternalLink: ProcessedLinkInfo | null = useMemo(() => {
    const link = formState.externalLink.trim()
    if (!link) return null

    const linkData = classifyExternalLink(link)
    let thumbnail: string | undefined

    if (linkData.platform === 'youtube' && linkData.type === 'content') {
      // Use ?? undefined to convert null to undefined, satisfying the type
      thumbnail = extractYouTubeThumbnail(link) ?? undefined
    }

    return {
      ...linkData,
      url: link,
      previewImage: thumbnail,
    }
  }, [formState.externalLink])

  // Auto-toggle advanced options if a link is typed
  useEffect(() => {
    if (formState.externalLink.trim() && !showAdvanced) {
      setShowAdvanced(true)
    }
  }, [formState.externalLink, showAdvanced])

  // --- Media Handlers ---

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
      // 1. Revoke the object URL for cleanup
      const fileToRemove = formState.mediaFiles[index]
      if (fileToRemove) {
        const previewUrl = URL.createObjectURL(fileToRemove)
        URL.revokeObjectURL(previewUrl)
      }

      // 2. Update state
      updateFormState(
        'mediaFiles',
        formState.mediaFiles.filter((_, i) => i !== index)
      )
    },
    [formState.mediaFiles, updateFormState]
  )

  // --- Reset Handler ---

  const resetForm = useCallback(() => {
    // Revoke all existing object URLs
    formState.mediaFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      URL.revokeObjectURL(url)
    })
    setFormState(initialFormState)
    setShowAdvanced(false)
  }, [formState.mediaFiles])

  return {
    formState,
    updateFormState,
    resetForm,
    processedExternalLink,
    showAdvanced,
    setShowAdvanced,
    handleMediaChange,
    removeMediaFile,
  }
}
