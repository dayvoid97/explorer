// app/components/CommentSection.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { getToken, getUsernameFromToken } from '@/app/lib/auth'
import Comment from './Comments'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface CommentType {
  id: string
  username: string
  text: string
  createdAt: number
  upvotes: number
}

export default function CommentSection({ winId }: { winId: string }) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<string>('')
  const [sort, setSort] = useState<'newest' | 'hottest'>('newest')

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (t) {
      const username = getUsernameFromToken(t)
      if (username) setCurrentUser(username)
    }
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`${API_URL}/gurkha/comment?winId=${winId}&sort=${sort}`)
      const data = await res.json()
      if (Array.isArray(data)) setComments(data)
    }

    fetchComments()
  }, [winId, sort])

  const handlePost = async () => {
    if (!newComment.trim() || !token) return
    const res = await fetch(`${API_URL}/gurkha/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ winId, text: newComment }),
    })

    if (res.ok) {
      setNewComment('')
      const updated = await res.json()
      // Ensure the newly added comment matches the CommentType interface
      setComments((prev) => [
        ...prev,
        { ...updated, text: newComment, username: currentUser, createdAt: Date.now() },
      ])
    }
    // TODO: Handle errors for failed post
  }

  const handleUpvote = async (commentId: string) => {
    if (!token) return
    const res = await fetch(`${API_URL}/gurkha/comment/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId }),
    })
    if (res.ok) {
      // Only update UI if API call was successful
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
      )
    }
    // TODO: Handle errors for failed upvote
  }

  const handleFlag = async (commentId: string) => {
    if (!token) return
    const res = await fetch(`${API_URL}/gurkha/comment/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId }),
    })
    if (res.ok) {
      // Only show alert if API call was successful
      alert('Comment flagged for review.')
    } else {
      alert('Failed to flag comment.')
    }
    // TODO: Handle specific errors like already flagged
  }

  const handleDelete = async (commentId: string) => {
    if (!token) return
    const confirmed = confirm('Are you sure you want to delete this comment?')
    if (!confirmed) return

    const res = await fetch(`${API_URL}/gurkha/comment?commentId=${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } else {
      alert('Failed to delete comment.')
    }
    // TODO: Handle errors for failed delete
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

      {token ? (
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
              onUpvote={handleUpvote}
              onFlag={handleFlag}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
