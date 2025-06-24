const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'access_token'
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'refresh_token'

// Call this after successful login (from LoginPage)
// Stores both the short-lived access token and the long-lived refresh token
export function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

// Used by authFetch to get the current access token for API requests
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }
  return null
}

// Used by authFetch when it needs to call the backend's /refresh endpoint
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return null
}

// Call this on explicit logout, or when a refresh attempt completely fails
// Clears both tokens from localStorage
export function removeTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

// For general UI checks (e.g., showing different UI for logged-in users)
export function isLoggedIn(): boolean {
  // A user is "logged in" if they have an access token (even if it's expired, it might be refreshable)
  return typeof window !== 'undefined' && !!localStorage.getItem(ACCESS_TOKEN_KEY)
}

// Still useful for decoding token payload for display purposes (e.g., username in header)
export function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.username || null
  } catch (e) {
    console.error('Invalid token payload or parsing error:', e)
    return null
  }
}

// Optional: Client-side check for token expiry (for better UX, not strictly for core auth flow)
export function isAccessTokenExpired(token: string | null): boolean {
  if (!token) return true // No token, so considered expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // JWT 'exp' is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch (e) {
    console.error('Error checking token expiry (malformed token):', e)
    return true // Treat as expired if parsing fails
  }
}
