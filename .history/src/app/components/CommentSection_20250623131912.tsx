'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
// UPDATED IMPORTS: Use authFetch for API calls, getAccessToken/getUsernameFromToken, and removeTokens
import { getAccessToken, getUsernameFromToken, removeTokens } from '@/app/lib/auth'
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import Comment from './Comments' // Ensure this path is correct

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface CommentType {
  id: string
  username: string
  text: string
  createdAt: number
  upvotes: number
  upvotedByCurrentUser?: boolean // Added this as Comment component uses it
  pfp?: string // Added this as Comment component uses it
}

export default function CommentSection({ winId }: { winId: string }) {
  const router = useRouter()
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Better name than 'token' state
  const [currentUser, setCurrentUser] = useState<string>('')
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest')
  const [apiError, setApiError] = useState<string | null>(null) // For general API errors
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null) // For custom delete confirmation

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setApiError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  // Effect to check authentication status and set current user
  useEffect(() => {
    const accessToken = getAccessToken()
    if (accessToken) {
      setIsAuthenticated(true)
      const username = getUsernameFromToken(accessToken)
      if (username) setCurrentUser(username)
    } else {
      setIsAuthenticated(false)
      setCurrentUser('')
    }
  }, []) // No dependencies, runs once on mount

  // Fetch comments (does not require auth)
  useEffect(() => {
    const fetchComments = async () => {
      setApiError(null) // Clear previous errors
      try {
        const res = await fetch(`${API_URL}/gurkha/comment?winId=${winId}&sort=${sort}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(
            data.message || data.error || `Failed to fetch comments (Status: ${res.status})`
          )
        }
        if (Array.isArray(data)) setComments(data)
      } catch (err: any) {
        console.error('Error fetching comments:', err)
        setApiError(err.message || 'Failed to load comments.')
      }
    }

    fetchComments()
  }, [winId, sort])

  // Handle posting a new comment (requires auth)
  const handlePost = async () => {
    if (!newComment.trim()) return // Don't post empty comments
    if (!isAuthenticated) {
      handleAuthRedirect('You must be logged in to post a comment.')
      return
    }
    setApiError(null) // Clear previous errors

    try {
      // CHANGED: Use authFetch for authenticated call
      const res = await authFetch(`${API_URL}/gurkha/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winId, text: newComment }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to post comment.')
      }

      setNewComment('')
      // Ensure the newly added comment matches the CommentType interface, assuming backend returns id, createdAt, upvotes
      setComments((prev) => [
        { ...data, text: newComment, username: currentUser, createdAt: Date.now() }, // Use data for ID/upvotes/etc.
        ...prev, // Add new comment to top for 'newest' sort
      ])
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
  }

  // handleUpvote, handleFlag, handleDelete are passed to <Comment />
  // They must accept the error propagated by authFetch and handle redirection
  const handleUpvote = async (commentId: string) => {
    if (!isAuthenticated) {
      handleAuthRedirect('You must be logged in to upvote.')
      return
    }
    setApiError(null) // Clear previous errors

    try {
      // CHANGED: Use authFetch for authenticated call
      const res = await authFetch(`${API_URL}/gurkha/comment/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to upvote comment.')
      }

      // Update UI only if API call was successful
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, upvotes: c.upvotes + 1, upvotedByCurrentUser: true } : c
        )
      )
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
  }

  const handleFlag = async (commentId: string) => {
    if (!isAuthenticated) {
      handleAuthRedirect('You must be logged in to flag a comment.')
      return
    }
    setApiError(null) // Clear previous errors

    try {
      // CHANGED: Use authFetch for authenticated call
      const res = await authFetch(`${API_URL}/gurkha/comment/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to flag comment.')
      }
      // Instead of alert, set success or temporary message
      setApiError('Comment flagged for review.') // Using error state for temporary message
      setTimeout(() => setApiError(null), 3000) // Clear after 3 seconds
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
  }

  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated) {
      handleAuthRedirect('You must be logged in to delete a comment.')
      return
    }
    setConfirmDeleteId(commentId) // Show confirmation modal
  }

  const confirmDelete = async () => {
    if (!confirmDeleteId) return

    setApiError(null) // Clear previous errors
    try {
      // CHANGED: Use authFetch for authenticated call
      const res = await authFetch(`${API_URL}/gurkha/comment?commentId=${confirmDeleteId}`, {
        method: 'DELETE',
        headers: {
          // authFetch adds Authorization header
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to delete comment.')
      }

      setComments((prev) => prev.filter((c) => c.id !== confirmDeleteId))
      setConfirmDeleteId(null) // Close confirmation
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
      setConfirmDeleteId(null) // Close confirmation even on error
    }
  }

  const cancelDelete = () => {
    setConfirmDeleteId(null)
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="flex gap-6 items-center border-b pb-3 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Comments</h2>
        <div className="ml-auto flex gap-4">
          <button
            onClick={() => setSort('newest')}
            className={`text-sm px-3 py-1 rounded-full transition ${
              sort === 'newest'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort('hottest')}
            className={`text-sm px-3 py-1 rounded-full transition ${
              sort === 'hottest'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            Hottest
          </button>
        </div>
      </div>

      {apiError && ( // Display general API error messages
        <p className="text-red-500 dark:text-red-400 text-sm">{apiError}</p>
      )}

      {/* Custom Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Deletion
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated ? (
        <div className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handlePost}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Log in
          </a>{' '}
          or{' '}
          <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            sign up
          </a>{' '}
          to leave a comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500 italic text-sm dark:text-gray-400">
          No comments yet. Be the first to speak your mind!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onUpvote={handleUpvote} // These now trigger upvote via authFetch
              onFlag={handleFlag} // These now trigger flag via authFetch
              onDelete={handleDelete} // This triggers delete confirmation
            />
          ))}
        </div>
      )}
    </div>
  )
}
