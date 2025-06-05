'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '@/app/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CommentSection({ winId }: { winId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [token, setToken] = useState<string | null>(null)

  const [sort, setSort] = useState<'newest' | 'hottest'>('newest')

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`${API_URL}/gurkha/comment?winId=${winId}&sort=${sort}`)
      const data = await res.json()
      if (Array.isArray(data)) setComments(data)
    }

    fetchComments()
  }, [winId, sort])

  const handlePost = async () => {
    if (!newComment.trim()) return
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

  return (
    <div className="mt-10 space-y-4">
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
        {comments.map((comment, idx) => (
          <div key={idx} className="border rounded-md p-3 bg-gray-50">
            <div className="text-sm text-gray-600">
              @{comment.username} on {new Date(comment.createdAt).toLocaleDateString()}
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
