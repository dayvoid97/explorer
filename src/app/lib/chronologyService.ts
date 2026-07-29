// lib/chronologyService.ts
import { authFetch } from './api'

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology`

export const chronologyService = {
  /**
   * Fetch Explore Feed (Handles Guest vs User internally on Backend)
   */
  getExplore: async (sort = 'recent') => {
    // We don't strictly need authFetch here because our new backend
    // route manually checks the JWT to allow guests in.
    const res = await authFetch(`${API_BASE}/explore?sort=${sort}`)
    if (!res.ok) throw new Error('Failed to fetch FG Knowledge')
    return res.json()
  },

  /**
   * Social Interactions (Universal Toggle)
   */
  interact: async (id: string, type: 'like' | 'save' | 'repost' | 'share') => {
    const res = await authFetch(`${API_BASE}/${id}/${type}`, {
      method: 'POST',
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || `Action ${type} failed`)
    }
    return res.json()
  },

  /**
   * Fetch the Full Chain (Deep Dive)
   */
  getChain: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}/chain`)
    if (!res.ok) throw new Error('Chronology chain not found')
    return res.json()
  },
}
