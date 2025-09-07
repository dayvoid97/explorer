'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { getAccessToken, getUsernameFromToken, removeTokens } from '../lib/auth'
import { authFetch } from '../lib/api'
import Comment from './Comments'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface CommentType {
  id: string
  username: string
  text: string
  createdAt: number
  upvotes: number
  upvotedByCurrentUser?: boolean
  pfp?: string
  ownerId: string
  parentId?: string
  replyCount?: number
  winId: string
  replies?: CommentType[]
}

interface ReplyState {
  id: string
  username: string
}

export default function CommentSection({ winId }: { winId: string }) {
  const router = useRouter()

  // State management
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string>('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest')
  const [apiError, setApiError] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<ReplyState | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set())

  // Authentication handler
  const handleAuthRedirect = useCallback(
    (errMessage: string = 'Session expired. Please log in again.') => {
      setApiError(errMessage)
      removeTokens()
      router.push('/login')
    },
    [router]
  )

  // Initialize authentication
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

  // Fetch comments with optimized error handling
  const fetchComments = useCallback(
    async (parentId?: string) => {
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
    fetchComments().then(setComments)
  }, [fetchComments])

  // Optimized reply expansion
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

  // Post comment/reply handler
  const handlePost = useCallback(async () => {
    if (!newComment.trim()) return
    if (!isAuthenticated || !currentUserId || !currentUser) {
      handleAuthRedirect('You must be logged in to post a comment.')
      return
    }

    setApiError(null)

    const commentPayload: {
      winId: string
      text: string
      parentId?: string
    } = {
      winId,
      text: newComment.trim(),
    }

    if (replyingTo?.id) {
      commentPayload.parentId = replyingTo.id
    }

    try {
      const res = await authFetch(`${API_URL}/gurkha/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to post comment.')
      }

      const newCommentData = { ...data, ownerId: data.userId, replies: [] }

      if (replyingTo?.id) {
        // Add reply to parent comment
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === replyingTo.id
              ? { ...comment, replies: [newCommentData, ...(comment.replies || [])] }
              : comment
          )
        )
      } else {
        // Add new top-level comment
        setComments((prev) => [newCommentData, ...prev])
      }

      setNewComment('')
      setReplyingTo(null)
    } catch (err: any) {
      console.error('Error posting comment:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to post comment.')
      }
    }
  }, [
    newComment,
    isAuthenticated,
    currentUserId,
    currentUser,
    winId,
    replyingTo,
    handleAuthRedirect,
  ])

  // Upvote handler
  const handleUpvote = useCallback(
    async (commentId: string) => {
      if (!isAuthenticated || !currentUserId) {
        handleAuthRedirect('You must be logged in to upvote.')
        return
      }

      setApiError(null)

      try {
        const res = await authFetch(`${API_URL}/gurkha/comment/upvote`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Failed to upvote comment.')
        }

        // Update upvote in nested structure
        const updateUpvote = (comments: CommentType[]): CommentType[] =>
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, upvotes: comment.upvotes + 1, upvotedByCurrentUser: true }
            }
            if (comment.replies) {
              return { ...comment, replies: updateUpvote(comment.replies) }
            }
            return comment
          })

        setComments(updateUpvote)
      } catch (err: any) {
        console.error('Error upvoting comment:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setApiError(err.message || 'Failed to upvote comment.')
        }
      }
    },
    [isAuthenticated, currentUserId, handleAuthRedirect]
  )

  // Flag handler
  const handleFlag = useCallback(
    async (commentId: string) => {
      if (!isAuthenticated) {
        handleAuthRedirect('You must be logged in to flag a comment.')
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
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setApiError(err.message || 'Failed to flag comment.')
        }
      }
    },
    [isAuthenticated, handleAuthRedirect]
  )

  // Delete handlers
  const handleDelete = useCallback(
    (commentId: string) => {
      if (!isAuthenticated) {
        handleAuthRedirect('You must be logged in to delete a comment.')
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

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to delete comment.')
      }

      // Remove comment from nested structure
      const removeComment = (comments: CommentType[]): CommentType[] =>
        comments
          .filter((comment) => comment.id !== confirmDeleteId)
          .map((comment) => ({
            ...comment,
            replies: comment.replies ? removeComment(comment.replies) : [],
          }))

      setComments(removeComment)
      setConfirmDeleteId(null)
    } catch (err: any) {
      console.error('Error deleting comment:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to delete comment.')
      }
      setConfirmDeleteId(null)
    }
  }, [confirmDeleteId, handleAuthRedirect])

  const cancelDelete = useCallback(() => {
    setConfirmDeleteId(null)
  }, [])

  // Reply handler
  const handleReply = useCallback((commentId: string, username: string) => {
    setReplyingTo({ id: commentId, username })
    setNewComment(`@${username} `)
  }, [])

  // Memoized sorted comments
  const sortedComments = useMemo(() => {
    const topLevelComments = comments.filter(
      (comment) => comment.parentId === comment.winId || !comment.parentId
    )

    return topLevelComments.sort((a, b) => {
      if (sort === 'newest') return b.createdAt - a.createdAt
      // For hottest, you might want to factor in upvotes and recency
      return (
        b.upvotes * 0.7 +
        (Date.now() - b.createdAt) * 0.3 -
        (a.upvotes * 0.7 + (Date.now() - a.createdAt) * 0.3)
      )
    })
  }, [comments, sort])

  // Optimized comment renderer
  const renderComment = useCallback(
    (comment: CommentType, depth: number = 0) => {
      const hasReplies = comment.replyCount && comment.replyCount > 0
      const isExpanded = expandedComments.has(comment.id)
      const isLoading = loadingReplies.has(comment.id)

      return (
        <div key={comment.id} className="comment-container">
          <Comment
            comment={{
              ...comment,
              replyingTo: replyingTo?.id === comment.id ? replyingTo.username : undefined,
            }}
            currentUser={currentUser}
            onUpvote={handleUpvote}
            onFlag={handleFlag}
            onDelete={handleDelete}
            onReply={handleReply}
            depth={depth}
          />

          {/* Reply expansion button */}
          {hasReplies && !isExpanded && (
            <button
              onClick={() => expandReplies(comment.id)}
              disabled={isLoading}
              className="ml-6 mt-2 text-blue-500 text-sm hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
              )}
            </button>
          )}

          {/* Nested replies */}
          {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      )
    },
    [
      expandedComments,
      loadingReplies,
      replyingTo,
      currentUser,
      handleUpvote,
      handleFlag,
      handleDelete,
      handleReply,
      expandReplies,
    ]
  )

  return (
    <div className="mt-12 space-y-8">
      {/* Header */}
      <div className="flex gap-6 items-center border-b pb-3 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        <div className="ml-auto flex gap-2">
          {(['newest', 'hottest'] as const).map((sortType) => (
            <button
              key={sortType}
              onClick={() => setSort(sortType)}
              className={`text-sm px-3 py-1 rounded-full transition ${
                sort === sortType
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {apiError && (
        <div
          className={`p-3 rounded-lg text-sm ${
            apiError.includes('flagged')
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {apiError}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment input */}
      {isAuthenticated ? (
        <div className="space-y-4">
          {replyingTo && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Replying to <span className="font-semibold">@{replyingTo.username}</span>
              </span>
              <button onClick={() => setReplyingTo(null)} className="text-blue-500 hover:underline">
                Cancel
              </button>
            </div>
          )}
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyingTo ? `Replying to @${replyingTo.username}...` : 'Write your thoughts...'
              }
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handlePost()
                }
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to post
              </span>
              <button
                onClick={handlePost}
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-lg transition"
              >
                {replyingTo ? 'Post Reply' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Log in
            </a>{' '}
            or{' '}
            <a
              href="/signup"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              sign up
            </a>{' '}
            to join the conversation
          </p>
        </div>
      )}

      <div className="mt-8">
        {/* AdSense Ad */}
        <div className="fg-wincard-comment-ad">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-8441965953327461"
            data-ad-slot="7779271603"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>

          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          <Script id="adsbygoogle-init" strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>
      </div>

      {/* Comments list */}
      {sortedComments.length > 0 ? (
        sortedComments.map((comment) => renderComment(comment))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  )
}
