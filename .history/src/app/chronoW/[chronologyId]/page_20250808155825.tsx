'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAccessToken, isLoggedIn } from '@/app/lib/auth'
import { ThumbsUp } from 'lucide-react'

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
  description?: string
  categories?: string[]
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
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-white mb-2">{chronology.name}</h1>
      <p className="text-md text-gray-400 mb-2 italic">By @{chronology.createdBy}</p>

      {chronology.description && (
        <p className="text-gray-300 mb-4 text-sm">{chronology.description}</p>
      )}

      {(chronology.categories ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {(chronology.categories ?? []).map((cat, i) => (
            <span
              key={i}
              className="text-xs font-semibold bg-blue-800/20 text-blue-300 px-2 py-0.5 rounded-full"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      {/* Timeline Thread */}
      <div className="relative space-y-10 before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-600/50">
        {wins
          .filter((w) => w.id)
          .map((win) => (
            <div key={win.id} className="relative flex gap-4 pl-14">
              <div className="absolute left-4 top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="bg-zinc-900 border border-gray-700 p-5 rounded-xl w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{win.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <ThumbsUp className="w-4 h-4" /> {win.upvotes}
                    <span>• {new Date(win.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-2">{win.preview}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Comment Box */}
      <div className="mt-14">
        <h2 className="text-2xl text-white font-semibold mb-4">💬 Thoughts?</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Drop your thoughts on this chain..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 mb-3"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Comment
        </button>

        <div className="mt-6 space-y-4">
          {comments
            .filter((c) => c.id)
            .map((comment) => (
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
