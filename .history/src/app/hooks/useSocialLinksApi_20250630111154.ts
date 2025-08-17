// hooks/useSocialLinksApi.ts
import { useState, useCallback } from 'react'

interface SocialLink {
  platform: string
  url: string
  id: string
}

interface UseSocialLinksApiResult {
  saveLinks: (links: SocialLink[]) => Promise<void>
  isLoading: boolean
  error: string | null
  success: string | null
  clearMessages: () => void
}

// Define the type for authFetch to ensure type safety
type AuthFetch = (url: string, options?: RequestInit) => Promise<Response>

export const useSocialLinksApi = (
  authFetch: AuthFetch,
  apiBaseUrl: string
): UseSocialLinksApiResult => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const saveLinks = useCallback(
    async (links: SocialLink[]) => {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        // Filter out the 'id' property as it's for frontend management only
        const linksToSave = links.map(({ id, ...rest }) => rest)

        const res = await authFetch(`${apiBaseUrl}/gurkha/users/links`, {
          method: 'PUT', // Changed to PUT
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ socialLinks: linksToSave }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || data.error || 'Failed to save social links.')
        }

        setSuccess('✅ Social links saved successfully!')
      } catch (err: any) {
        console.error('Failed to save social links:', err)
        setError(err.message || 'An unexpected error occurred while saving links.')
      } finally {
        setIsLoading(false)
      }
    },
    [authFetch, apiBaseUrl]
  )

  return { saveLinks, isLoading, error, success, clearMessages }
}
