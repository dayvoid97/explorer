import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  removeTokens,
  getNotificationToken,
} from './auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// This function will handle token refreshing
async function refreshAuthToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  const notificationToken = getNotificationToken()
  if (!refreshToken) {
    console.warn('No refresh token available. Cannot refresh.')
    removeTokens()
    return null
  }

  try {
    const res = await fetch(`${API_BASE}/gurkha/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await res.json()

    if (!res.ok || !data.accessToken) {
      console.error('Failed to refresh token:', data.message || res.statusText)
      removeTokens() // Refresh failed, clear tokens
      return null // Indicates refresh failed, requires full re-login
    }

    // Store new access token (and new refresh if your backend returns it with rotation)
    storeTokens(data.accessToken, data.refreshToken || refreshToken, data.notificationToken)
    return data.accessToken
  } catch (error) {
    console.error('Network error during token refresh or invalid response:', error)
    removeTokens() // Clear tokens on network error
    return null // Indicates refresh failed, requires full re-login
  }
}

// --- Custom Fetch Wrapper with Interception Logic ---
// Use this function for all API calls that require authentication.
export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  let accessToken = getAccessToken()
  const headers = new Headers(init?.headers)

  // If we have an access token, add it to the request
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const requestInit: RequestInit = { ...init, headers }

  // Try the request with the current token
  let response = await fetch(input, requestInit)

  // If the response indicates an expired token (and it's a specific code from your backend)
  if (response.status === 401) {
    const errorData = await response.clone().json() // Clone response to read body
    if (errorData.code === 'TOKEN_EXPIRED') {
      console.log('Access token expired. Attempting to refresh...')
      const newAccessToken = await refreshAuthToken()

      if (newAccessToken) {
        // Token refreshed successfully, retry the original request
        headers.set('Authorization', `Bearer ${newAccessToken}`)
        requestInit.headers = headers // Update headers in retry request
        console.log('Token refreshed. Retrying original request...')
        response = await fetch(input, requestInit) // Retry the original request
      } else {
        // Refresh failed, throw an error to signal full re-login is needed
        throw new Error('Authentication required. Please log in again.')
      }
    } else {
      throw new Error(errorData.message || 'Authentication required. Please log in again.')
    }
  } else if (response.status === 403) {
    const errorData = await response.clone().json()
    throw new Error(errorData.message || 'Access denied. Invalid token.')
  }

  // For non-error responses, or after successful refresh and retry, return the response.
  return response
}
