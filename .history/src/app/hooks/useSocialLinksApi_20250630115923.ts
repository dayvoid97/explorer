// hooks/useSocialLinksApi.ts
import { useState, useCallback } from 'react'

interface BackendSocialLink {
  social_id: string
  social_link: string
  social_identifier: string
}

// Define the type for authFetch to ensure type safety
type AuthFetch = (url: string, options?: RequestInit) => Promise<Response>

interface UseSocialLinksApiResult {
  addOrUpdateLink: (link: BackendSocialLink) => Promise<void>
  deleteLink: (socialIdentifier: string) => Promise<void> // Deletes by social_identifier
  isLoading: boolean
  error: string | null
  success: string | null
  clearMessages: () => void
}

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

  // Function to add or update a social link
  const addOrUpdateLink = useCallback(
    async (link: BackendSocialLink) => {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const res = await authFetch(`${apiBaseUrl}/gurkha/users/links`, {
          method: 'PUT', // Use PUT for adding/updating
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addOrUpdate',
            social_id: link.social_id,
            social_link: link.social_link,
            social_identifier: link.social_identifier,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(
            data.message || data.error || `Failed to add/update ${link.social_id} link.`
          )
        }

        setSuccess(`✅ ${link.social_id} link saved successfully!`)
      } catch (err: any) {
        console.error(`Failed to add/update ${link.social_id} link:`, err)
        setError(err.message || 'An unexpected error occurred while saving the link.')
      } finally {
        setIsLoading(false)
      }
    },
    [authFetch, apiBaseUrl]
  )

  // Function to delete a social link by its unique identifier
  const deleteLink = useCallback(
    async (socialIdentifier: string) => {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const res = await authFetch(`${apiBaseUrl}/gurkha/users/links`, {
          method: 'PUT', // Use PUT for deleting as well, with action in body
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', social_identifier: socialIdentifier }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || data.error || `Failed to delete link.`)
        }

        setSuccess(`🗑️ Link deleted successfully!`)
      } catch (err: any) {
        console.error(`Failed to delete link with identifier ${socialIdentifier}:`, err)
        setError(err.message || 'An unexpected error occurred while deleting the link.')
      } finally {
        setIsLoading(false)
      }
    },
    [authFetch, apiBaseUrl]
  )

  return { addOrUpdateLink, deleteLink, isLoading, error, success, clearMessages }
}
