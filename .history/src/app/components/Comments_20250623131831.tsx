'use client'

import React, { useState } from 'react'
// UPDATED IMPORTS: No longer need getToken directly here
import { Heart, Flag, Trash2, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
// Note: Your 'useHeatmapTracker' hook needs to be updated internally
// to use 'authFetch' and no longer take a 'token' parameter.
import { useHeatmapTracker } from '../hooks/useHeatMapTracker'
// Add removeTokens for potential redirects from heatmap tracker if it errors out
import { removeTokens } from '@/app/lib/auth'

interface CommentProps {
  comment: {
    id: string
    username: string
    text: string
    createdAt: number
    upvotes: number
    upvotedByCurrentUser?: boolean
    pfp?: string
  }
  currentUser: string
  // These functions are expected to use authFetch internally now
  onUpvote: (commentId: string) => void
  onFlag: (commentId: string) => void
  onDelete: (commentId: string) => void
}

export default function Comment({
  comment,
  currentUser,
  onUpvote,
  onFlag,
  onDelete,
}: CommentProps) {
  const router = useRouter()
  // REMOVED: const token = getToken(); - authFetch handles this internally
  // UPDATED: useHeatmapTracker should not need 'token' anymore
  const { onMouseEnter, onClick } = useHeatmapTracker(comment.id) // Assuming updated useHeatmapTracker

  const [isUpvoted, setIsUpvoted] = useState(comment.upvotedByCurrentUser ?? false)
  const [showActions, setShowActions] = useState(false)

  // Helper for consistent auth redirection (if internal actions cause it, e.g., heatmap)
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    console.error('Auth error in Comment:', errMessage)
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const handleUpvote = () => {
    // This component only calls onUpvote prop; onUpvote should handle auth
    if (!isUpvoted) {
      setIsUpvoted(true)
      onUpvote(comment.id) // Parent's onUpvote must use authFetch
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const handleProfileClick = () => {
    router.push(`/publicprofile/${comment.username}`)
  }

  return (
    <article
      // Added dark mode classes for background and border
      className="group relative rounded-2xl bg-white dark:bg-gray-900 p-6 border dark:border-gray-700 shadow-sm"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* Header: Avatar + Username */}
      <header className="flex items-start justify-between mb-4">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          onClick={handleProfileClick}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {comment.pfp ? (
              <img
                src={comment.pfp}
                alt={`@${comment.username}`}
                className="w-10 h-10 object-cover rounded-full border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {comment.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              @{comment.username}
            </span>
            <time className="block text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(comment.createdAt)}
            </time>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }} // Stop propagation
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFlag(comment.id)
                  setShowActions(false)
                }} // Stop propagation
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Flag className="w-4 h-4" /> Report
              </button>
              {comment.username === currentUser && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(comment.id)
                    setShowActions(false)
                  }} // Stop propagation
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Comment Text */}
      <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base mb-4">
        {comment.text}
      </p>

      {/* Footer: Upvote */}
      <footer className="flex items-center justify-between border-t pt-3 dark:border-gray-700">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-2 text-sm rounded-full px-3 py-1 transition ${
            isUpvoted
              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
          {comment.upvotes + (isUpvoted ? 1 : 0)}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">💬 Active</span>
      </footer>
    </article>
  )
}
