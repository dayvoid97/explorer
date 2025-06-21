const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'auth_token'

export function storeToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function isLoggedIn(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)
}

export function getUsernameFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.username || null
  } catch (e) {
    console.error('Invalid token:', e)
    return null
  }
}
