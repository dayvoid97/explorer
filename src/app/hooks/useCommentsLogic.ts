// @/app/hooks/useCommentsLogic.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getAccessToken, getUsernameFromToken, removeTokens } from '../lib/auth'
import { authFetch } from '../lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Re-exporting interfaces for use in CommentSection
export interface CommentType {
  id: string
  username: string
  text: string
  createdAt: number
  upvotes: number
  upvotedByCurrentUser?: boolean
  // 🟢 Changed from upvoters (boolean) to voters (number)
  voters?: Record<string, number>

  heatmap?: {
    clicks: number
    hovers: number
    engagementScore: number
  }
  pfp?: string
  ownerId: string
  parentId?: string
  replyCount?: number
  winId: string
  replies?: CommentType[]
}

export interface ReplyState {
  id: string
  username: string
  parentId: string // Add this line
}

interface UseCommentsLogicProps {
  winId: string
}

export const useCommentsLogic = ({ winId }: UseCommentsLogicProps) => {
  const router = useRouter()

  // --- State Management ---
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Add this state
  const [currentUser, setCurrentUser] = useState<string>('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest')
  const [apiError, setApiError] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<ReplyState | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set())

  // --- Authentication and Utility Handlers ---

  const handleAuthRedirect = useCallback(
    (errMessage: string = 'Session expired. Please log in again.') => {
      setApiError(errMessage)
      removeTokens()
      router.push('/login')
    },
    [router]
  )

  useEffect(() => {
    const accessToken = getAccessToken()
    if (accessToken) {
      setIsAuthenticated(true)
      const username = getUsernameFromToken(accessToken)
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]))
        setCurrentUserId(payload.id)
      } catch (e) {
        console.error('Error decoding access token for user ID:', e)
        setCurrentUserId(null)
      }
      if (username) setCurrentUser(username)
    } else {
      setIsAuthenticated(false)
      setCurrentUser('')
      setCurrentUserId(null)
    }
  }, [])

  /// engagement tracking

  // Inside @/app/hooks/useCommentsLogic.ts

  const trackEngagement = useCallback(async (commentId: string, event: 'clicks' | 'hovers') => {
    // 1. Double check we have a token before even trying
    const token = getAccessToken()
    if (!token) return

    try {
      const res = await authFetch(`${API_URL}/gurkha/comment/track-engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, event }),
      })

      if (!res.ok) {
        const error = await res.json()
        console.warn('Engagement skip:', error.message)
      }
    } catch (err) {
      console.error('Engagement tracking network error:', err)
    }
  }, [])

  // --- Fetching and Expansion Logic ---

  const fetchComments = useCallback(
    async (parentId?: string): Promise<CommentType[]> => {
      setApiError(null)
      try {
        const url = parentId
          ? `${API_URL}/gurkha/comment?winId=${winId}&parentId=${parentId}&sort=${sort}`
          : `${API_URL}/gurkha/comment?winId=${winId}&sort=${sort}`
        const res = await fetch(url)
        const data = await res.json()

        if (!res.ok)
          throw new Error(
            data.message || data.error || `Failed to fetch comments (Status: ${res.status})`
          )

        return Array.isArray(data) ? data : []
      } catch (err: any) {
        setApiError(err.message || 'Failed to load comments.')
        return []
      }
    },
    [winId, sort]
  )

  useEffect(() => {
    // Reset state and fetch top-level comments when sort changes
    setExpandedComments(new Set())
    setComments([])
    fetchComments().then(setComments)
  }, [fetchComments, sort]) // Reruns when sort changes

  const expandReplies = useCallback(
    async (parentId: string) => {
      if (expandedComments.has(parentId) || loadingReplies.has(parentId)) return
      setLoadingReplies((prev) => new Set(prev).add(parentId))
      try {
        const replies = await fetchComments(parentId)
        setComments((prev) =>
          prev.map((comment) => (comment.id === parentId ? { ...comment, replies } : comment))
        )
        setExpandedComments((prev) => new Set(prev).add(parentId))
      } finally {
        setLoadingReplies((prev) => {
          const newSet = new Set(prev)
          newSet.delete(parentId)
          return newSet
        })
      }
    },
    [expandedComments, loadingReplies, fetchComments]
  )

  // --- CRUD Handlers ---

  const handlePost = useCallback(async () => {
    if (!newComment.trim()) return

    const token = getAccessToken()
    if (!token) {
      handleAuthRedirect('You must be logged in to post a comment.')
      return
    }

    setIsSubmitting(true)

    // 1. Identify Target
    const isTargetingReply = replyingTo && replyingTo.parentId !== winId
    const effectiveParentId = isTargetingReply ? replyingTo.parentId : replyingTo?.id || winId

    try {
      const res = await authFetch(`${API_URL}/gurkha/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winId,
          text: newComment.trim(),
          parentId: effectiveParentId,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post comment.')

      const newCommentData: CommentType = {
        ...data,
        ownerId: data.userId,
        replies: [],
        // Ensure we have the parentId for the frontend logic
        parentId: effectiveParentId,
      }

      setComments((prev) => {
        // If it's a reply
        if (effectiveParentId !== winId) {
          return prev.map((comment) => {
            if (comment.id === effectiveParentId) {
              // Check if reply already exists to prevent double-loading
              const exists = comment.replies?.some((r) => r.id === newCommentData.id)
              if (exists) return comment

              return {
                ...comment,
                replyCount: (comment.replyCount || 0) + 1,
                replies: [newCommentData, ...(comment.replies || [])],
              }
            }
            return comment
          })
        }

        // If it's a top-level comment, check for duplicates before adding
        const exists = prev.some((c) => c.id === newCommentData.id)
        return exists ? prev : [newCommentData, ...prev]
      })

      // 2. Auto-expand the parent if it's a reply so the user sees their post
      if (effectiveParentId !== winId) {
        setExpandedComments((prev) => new Set(prev).add(effectiveParentId))
      }

      setNewComment('')
      setReplyingTo(null)
    } catch (err: any) {
      setApiError(err.message || 'Failed to post comment.')
    } finally {
      setIsSubmitting(false)
    }
  }, [newComment, winId, replyingTo, handleAuthRedirect])

  // Add this to your CommentType interface
  // voters?: Record<string, number>

  const handleVote = useCallback(
    async (commentId: string, voteValue: 1 | -1) => {
      if (!isAuthenticated) return handleAuthRedirect()

      try {
        const res = await authFetch(`${API_URL}/gurkha/comment/vote`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId, voteValue }),
        })

        const { userVote } = await res.json()

        const updateState = (items: CommentType[]): CommentType[] =>
          items.map((c) => {
            if (c.id === commentId) {
              // We don't calculate the math here, we wait for the next fetch
              // OR we can calculate it optimistically:
              const oldVote = c.voters?.[currentUser] || 0
              const diff = userVote - oldVote
              return {
                ...c,
                upvotes: c.upvotes + diff,
                voters: { ...c.voters, [currentUser]: userVote },
              }
            }
            if (c.replies) return { ...c, replies: updateState(c.replies) }
            return c
          })

        setComments(updateState)
      } catch (err) {
        setApiError('Failed to vote')
      }
    },
    [isAuthenticated, currentUser]
  )

  const handleFlag = useCallback(
    async (commentId: string) => {
      // ... (Flag logic from original component)
      const token = getAccessToken()

      if (!token) {
        handleAuthRedirect('You must be logged in to post a comment.')
        return
      }

      // 2. Fallback check for state (only if you really need to)
      if (!isAuthenticated && !token) {
        handleAuthRedirect()
        return
      }
      setApiError(null)

      try {
        const res = await authFetch(`${API_URL}/gurkha/comment/flag`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || data.error || 'Failed to flag comment.')
        }

        setApiError('Comment flagged for review.')
        setTimeout(() => setApiError(null), 3000)
      } catch (err: any) {
        console.error('Error flagging comment:', err)
        if (err.message.includes('Authentication')) handleAuthRedirect(err.message)
        else setApiError(err.message || 'Failed to flag comment.')
      }
    },
    [isAuthenticated, handleAuthRedirect]
  )

  const handleDelete = useCallback(
    (commentId: string) => {
      const token = getAccessToken()

      if (!token) {
        handleAuthRedirect('You must be logged in to post a comment.')
        return
      }

      // 2. Fallback check for state (only if you really need to)
      if (!isAuthenticated && !token) {
        handleAuthRedirect()
        return
      }
      setConfirmDeleteId(commentId)
    },
    [isAuthenticated, handleAuthRedirect]
  )

  const confirmDelete = useCallback(async () => {
    if (!confirmDeleteId) return
    setApiError(null)

    try {
      const res = await authFetch(`${API_URL}/gurkha/comment?commentId=${confirmDeleteId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      setComments((prev) => {
        const updateList = (list: CommentType[]): CommentType[] => {
          return list
            .map((c) => {
              if (c.id === confirmDeleteId) {
                // If it has replies, transform it instead of removing
                if (c.replyCount && c.replyCount > 0) {
                  return { ...c, text: '[comment deleted by owner]', isDeleted: true }
                }
                return null as any // Mark for filtering
              }
              if (c.replies) {
                return { ...c, replies: updateList(c.replies) }
              }
              return c
            })
            .filter(Boolean)
        }
        return updateList(prev)
      })

      setConfirmDeleteId(null)
    } catch (err: any) {
      setApiError(err.message)
      setConfirmDeleteId(null)
    }
  }, [confirmDeleteId])

  const cancelDelete = useCallback(() => {
    setConfirmDeleteId(null)
  }, [])

  const handleReply = useCallback((commentId: string, username: string, parentId: string) => {
    // Now ReplyState will have all 3 properties
    setReplyingTo({ id: commentId, username, parentId })
    setNewComment(`@${username} `)
  }, [])

  // --- Memoized Data ---

  const sortedComments = useMemo(() => {
    // Top-level comments are already being set by fetchComments without parentId
    // But we sort them client-side for "hottest" calculation
    if (sort === 'newest') {
      // If server fetched by newest, they are already in order, just return
      return comments
    }

    return [...comments].sort((a, b) => {
      // Hotness calculation: 70% upvotes, 30% recency (inverted timestamp for sorting desc)
      const hotnessA = a.upvotes * 0.7 + (Date.now() - a.createdAt) * 0.3
      const hotnessB = b.upvotes * 0.7 + (Date.now() - b.createdAt) * 0.3
      return hotnessB - hotnessA
    })
  }, [comments, sort])

  return {
    // State
    comments,
    newComment,
    isAuthenticated,
    currentUser,
    currentUserId,
    sort,
    apiError,
    confirmDeleteId,
    isSubmitting,
    replyingTo,
    expandedComments,
    loadingReplies,

    // Handlers
    setNewComment,
    trackEngagement,
    setSort,
    setReplyingTo,
    handlePost,
    handleVote,
    handleFlag,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleReply,
    expandReplies,
    handleAuthRedirect,

    // Data
    sortedComments,
  }
}
