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
  const accessToken = getAccessToken()
  const headers = new Headers(init?.headers)

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  } else {
    console.warn('⚠️ [authFetch] No access token found in localStorage before request.')
  }

  const requestInit: RequestInit = { ...init, headers }

  console.log(`🚀 [authFetch] Requesting: ${input}`)
  let response = await fetch(input, requestInit)

  if (response.status === 401) {
    let errorData
    try {
      errorData = await response.clone().json()
      console.error('❌ [authFetch] 401 Unauthorized Body:', errorData)
    } catch (e) {
      console.error('❌ [authFetch] 401 Unauthorized (Could not parse JSON body)')
    }

    if (errorData?.code === 'TOKEN_EXPIRED') {
      console.log('🔄 [authFetch] Detected TOKEN_EXPIRED. Attempting refresh...')
      const newAccessToken = await refreshAuthToken()

      if (newAccessToken) {
        console.log('✅ [authFetch] Refresh successful. Retrying original request.')
        headers.set('Authorization', `Bearer ${newAccessToken}`)
        requestInit.headers = headers
        response = await fetch(input, requestInit)
      } else {
        console.error('⛔ [authFetch] Refresh failed. Forcing logout.')
        throw new Error('Authentication required. Please log in again.')
      }
    } else {
      // Log exactly why it's falling through to the generic error
      console.warn(
        `⚠️ [authFetch] 401 received but code was "${errorData?.code}", not "TOKEN_EXPIRED".`
      )
      throw new Error(errorData?.message || 'Authentication required. Please log in again.')
    }
  } else if (response.status === 403) {
    const errorData = await response
      .clone()
      .json()
      .catch(() => ({}))
    console.error('🚫 [authFetch] 403 Forbidden:', errorData)
    throw new Error(errorData.message || 'Access denied. Invalid token.')
  }

  return response
}
