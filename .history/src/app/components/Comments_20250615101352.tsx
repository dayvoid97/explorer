// app/components/Comment.tsx (Create this new file)
import React, { useState } from 'react'
import { useHeatmapTracker } from '../hooks/useHeatMapTracker' // Adjust path
import { getToken } from '@/app/lib/auth' // Assuming getToken is relevant here too

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
  const token = getToken() // Get token here, or pass it down from CommentSection

  // Call the hook directly inside the component for each individual comment
  const { onMouseEnter, onClick } = useHeatmapTracker(comment.id, token)

  return (
    <div
      key={comment.id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition hover:shadow-md"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>
          @{comment.username} &bull; {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => onUpvote(comment.id)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            👍 {comment.upvotes}
          </button>
          <button
            onClick={() => onFlag(comment.id)}
            className="text-red-500 dark:text-red-400 hover:underline"
          >
            🚩 Flag
          </button>
          {comment.username === currentUser && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-gray-400 hover:text-black dark:hover:text-white hover:underline"
            >
              ❌ Delete
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{comment.text}</p>
    </div>
  )
}
