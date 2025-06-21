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
  }
  currentUser: string
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
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const token = getToken()

  const { onMouseEnter, onClick } = useHeatmapTracker(comment.id, token)

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
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
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-gray-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/80 border border-gray-200/60 dark:border-gray-700/50 shadow-sm hover:shadow-xl dark:hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 transition-all duration-500 ease-out hover:-translate-y-1 backdrop-blur-sm"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={{
        // Golden ratio proportions
        aspectRatio: 'auto',
        minHeight: 'fit-content',
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05] pointer-events-none" />

      {/* Main content container with golden ratio padding */}
      <div className="relative p-6 sm:p-8" style={{ paddingBottom: 'calc(1.618 * 1rem)' }}>
        {/* Header with user info */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Avatar placeholder with gradient */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {comment.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                @{comment.username}
              </span>
              <time className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {formatTimeAgo(comment.createdAt)}
              </time>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                <button
                  onClick={() => onFlag(comment.id)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </button>
                {comment.username === currentUser && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Comment text with golden ratio typography */}
        <div className="mb-6">
          <p
            className="text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg"
            style={{
              lineHeight: '1.618', // Golden ratio line height
              fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)', // Responsive font size
            }}
          >
            {comment.text}
          </p>
        </div>

        {/* Footer with engagement */}
        <footer className="flex items-center justify-between pt-4 border-t border-gray-100/80 dark:border-gray-700/50">
          <div className="flex items-center space-x-4">
            {/* Upvote button */}
            <button
              onClick={handleUpvote}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isUpvoted
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 scale-105'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isUpvoted ? 'fill-current scale-110' : ''
                }`}
              />
              <span className="text-sm font-medium">{comment.upvotes + (isUpvoted ? 1 : 0)}</span>
            </button>
          </div>

          {/* Engagement indicator */}
          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Active</span>
          </div>
        </footer>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 dark:group-hover:border-blue-400/30 transition-all duration-500 pointer-events-none" />
    </article>
  )
}
