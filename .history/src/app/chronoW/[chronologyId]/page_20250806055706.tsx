'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAccessToken, isLoggedIn } from '@/app/lib/auth'

interface Win {
  id: string
  title: string
  preview: string
  createdAt: string
  upvotes: number
}

interface Chronology {
  id: string
  name: string
  createdBy: string
  createdAt: number
}

interface Comment {
  id: string
  text: string
  username: string
  createdAt: number
}

export default function ChronologyDetailPage() {
  const { chronologyId } = useParams()
  const [chronology, setChronology] = useState<Chronology | null>(null)
  const [wins, setWins] = useState<Win[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchChain = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${chronologyId}/chain`
      )
      const data = await res.json()
      setChronology(data.chronology)
      setWins(data.wins)
    }

    const fetchComments = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${chronologyId}/comments`
      )
      const data = await res.json()
      setComments(data.comments || [])
    }

    if (chronologyId) {
      fetchChain()
      fetchComments()
    }
  }, [chronologyId])

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    if (!isLoggedIn()) return alert('Login to comment')

    const token = await getAccessToken()
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${chronologyId}/comment`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
      }
    )

    const data = await res.json()
    setComments((prev) => [data.comment, ...prev])
    setNewComment('')
  }

  if (!chronology) return <p className="text-center text-white">Loading...</p>

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">{chronology.name}</h1>
      <p className="text-sm text-gray-400 mb-6">By {chronology.createdBy}</p>

      <div className="space-y-6 border-l-2 border-blue-500 pl-6 relative">
        {wins.map((win, i) => (
          <div key={win.id} className="relative">
            <div className="absolute -left-[18px] top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold">{win.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{win.preview}</p>
              <p className="text-xs text-gray-500 mt-2">
                🗓 {new Date(win.createdAt).toLocaleDateString()} • 👍 {win.upvotes}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Box */}
      <div className="mt-10">
        <h2 className="text-xl text-white font-semibold mb-3">💬 Comments</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Drop your thoughts..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 mb-3"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Comment
        </button>

        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700"
            >
              <p className="text-white text-sm">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                ✍️ {comment.username} • {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
