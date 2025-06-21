'use client'

import React from 'react'
import { useHeatmapTracker } from '../hooks/useHeatMapTracker'
import { getToken } from '@/app/lib/auth'

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
  const token = getToken()

  const { onMouseEnter, onClick } = useHeatmapTracker(comment.id, token)

  return (
    <div
      key={comment.id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition hover:shadow-md"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        {' '}
        {/* Added mb-2 for spacing */}
        <span className="font-semibold text-gray-700 dark:text-gray-300">@{comment.username}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
        {comment.text}
      </p>{' '}
      {/* Added leading-relaxed */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        {' '}
        {comment.username === currentUser && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm ml-auto" // ml-auto pushes it to the right
            title="Delete comment"
          >
            🗑️ Delete {/* Changed from ❌ to 🗑️ for a softer look, or keep ❌ if preferred */}
          </button>
        )}
      </div>
    </div>
  )
}
