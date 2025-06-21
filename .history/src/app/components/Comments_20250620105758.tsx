'use client'

import React, { useState } from 'react'
import { useHeatmapTracker } from '../hooks/useHeatMapTracker'
import { getToken } from '@/app/lib/auth'
import { Heart, Flag, Trash2, MoreHorizontal } from 'lucide-react'

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
  onUpvote: (commentId: string) => void
  onFlag: (commentId: string) => void
  onDelete: (commentId: string) => void
}

function Comment({ comment, currentUser, onUpvote, onFlag, onDelete }: CommentProps) {
  const [isUpvoted, setIsUpvoted] = useState(comment.upvotedByCurrentUser ?? false)
  const [showActions, setShowActions] = useState(false)
  const token = getToken()
  const { onMouseEnter, onClick } = useHeatmapTracker(comment.id, token)

  const handleUpvote = () => {
    if (isUpvoted) return
    setIsUpvoted(true)
    onUpvote(comment.id)
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <article
      className="group relative rounded-2xl bg-white dark:bg-gray-900 p-6 border dark:border-gray-700"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <header className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {comment.pfp ? (
              <img
                src={comment.pfp}
                alt={`${comment.username}'s avatar`}
                className="w-10 h-10 object-cover rounded-full border border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {comment.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              @{comment.username}
            </span>
            <time className="block text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(comment.createdAt)}
            </time>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-10">
              <button
                onClick={() => onFlag(comment.id)}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Flag className="w-4 h-4 mr-2" /> Report
              </button>
              {comment.username === currentUser && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </header>
      <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base mb-4">
        {comment.text}
      </p>
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
        <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
      </footer>
    </article>
  )
}

export default React.memo(Comment)
