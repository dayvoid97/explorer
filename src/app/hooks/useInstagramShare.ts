import { useState } from 'react'
import { generateWinImageBlob } from '../lib/imageGenerator'

export interface UseInstagramShareReturn {
  generateAndDownload: (win: any) => Promise<void>
  isGenerating: boolean
  error: string | null
}

export function useInstagramShare(): UseInstagramShareReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAndDownload = async (win: any) => {
    setIsGenerating(true)
    setError(null)

    try {
      // Generate the image
      const imageBlob = await generateWinImageBlob(win)

      // Create download
      const url = URL.createObjectURL(imageBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `redub-${win.id}-${Date.now()}.png`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      URL.revokeObjectURL(url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image'
      setError(errorMessage)
      console.error('Instagram share error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateAndDownload,
    isGenerating,
    error,
  }
}
