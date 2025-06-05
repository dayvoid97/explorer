'use client'

import React, { useEffect, useState } from 'react'
import { getToken, getUsernameFromToken } from '@/app/lib/auth'
import { useHeatmapTracker } from '../hooks/useHeatMapTracker'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Comment {
  id: string
  username: string
  text: string
  createdAt: number
  upvotes: number
}

export default function CommentSection({ winId }: { winId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
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
      setComments((prev) => [...prev, { ...updated, text: newComment }])
    }
  }

  const handleUpvote = async (commentId: string) => {
    if (!token) return
    await fetch(`${API_URL}/gurkha/comment/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId }),
    })
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
    )
  }

  const handleFlag = async (commentId: string) => {
    if (!token) return
    await fetch(`${API_URL}/gurkha/comment/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId }),
    })
    alert('Comment flagged for review.')
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
    }
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="flex gap-4">
        <button onClick={() => setSort('newest')} className="underline">
          Newest
        </button>
        <button onClick={() => setSort('hottest')} className="underline">
          Hottest
        </button>
      </div>

      <h2 className="text-xl font-semibold">Comments</h2>
      {token ? (
        <div className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full border rounded-md p-2"
          />
          <button
            onClick={handlePost}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-600">
          <a href="/login" className="text-blue-600 underline">
            Log in
          </a>{' '}
          or{' '}
          <a href="/signup" className="text-blue-600 underline">
            sign up
          </a>{' '}
          to comment.
        </p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => {
          const { onMouseEnter, onMouseLeave, onClick } = useHeatmapTracker(comment.id, token)
          return (
            <div
              key={comment.id}
              className="border rounded-md p-3 bg-gray-50"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={onClick}
            >
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  @{comment.username} on {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleUpvote(comment.id)} className="text-blue-600">
                    👍 {comment.upvotes}
                  </button>
                  <button onClick={() => handleFlag(comment.id)} className="text-red-500">
                    🚩 Flag
                  </button>
                  {comment.username === currentUser && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-400 hover:text-black"
                    >
                      ❌ Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2">{comment.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
