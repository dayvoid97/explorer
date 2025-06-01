// src/lib/auth.ts

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'auth_token'

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return !!getToken()
}
