'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAccessToken, isLoggedIn } from '@/app/lib/auth'
import ThreadItem, { Win } from '../../components/ThreadItem'
import ProgressRail from '@/app/components/ProgressRail'

interface Chronology {
  id: string
  name: string
  createdBy: string
  createdAt: number
  description?: string
  categories?: string[]
  isPrivate?: boolean
}

interface Comment {
  id: string
  text: string
  username: string
  createdAt: number
}

export default function ChronologyDetailPage() {
  const { chronologyId } = useParams<{ chronologyId: string }>()
  const [chronology, setChronology] = useState<Chronology | null>(null)
  const [wins, setWins] = useState<Win[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL
        const [chainRes, commentsRes] = await Promise.all([
          fetch(`${base}/gurkha/chronology/${chronologyId}/chain`),
          fetch(`${base}/gurkha/chronology/${chronologyId}/comments`),
        ])
        const chain = await chainRes.json()
        const comm = await commentsRes.json()
        setChronology(chain.chronology ?? null)
        setWins((chain.wins ?? []).filter((w: Win) => !!w.id))
        setComments(comm.comments ?? [])
      } finally {
        setLoading(false)
      }
    }
    if (chronologyId) load()
  }, [chronologyId])

  const itemIds = useMemo(() => wins.map((w) => w.id), [wins])

  const submitComment = async () => {
    if (!newComment.trim()) return
    if (!isLoggedIn()) return alert('Login to comment')
    const token = await getAccessToken()
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${chronologyId}/comment`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      }
    )
    const data = await res.json()
    if (data?.comment) {
      setComments((prev) => [data.comment, ...prev])
      setNewComment('')
    }
  }

  if (loading) return <p className="py-16 text-center text-white">Loading…</p>
  if (!chronology) return <p className="py-16 text-center text-white">Not found.</p>

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-4xl font-extrabold text-white">{chronology.name}</h1>
      <p className="text-md mb-2 italic text-gray-400">By @{chronology.createdBy}</p>
      {chronology.description && (
        <p className="mb-4 text-sm text-gray-300">{chronology.description}</p>
      )}
      {(chronology.categories ?? []).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {(chronology.categories ?? []).map((cat, i) => (
            <span
              key={i}
              className="rounded-full bg-blue-800/20 px-2 py-0.5 text-xs font-semibold text-blue-300"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      {/* progress rail */}
      <ProgressRail itemIds={itemIds} />

      {/* thread */}
      <div className="relative space-y-10 md:before:absolute md:before:left-5 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-blue-600/50">
        {wins.map((win) => (
          <div key={win.id} id={`win-${win.id}`} className="relative flex gap-4 pl-14">
            <div className="absolute left-4 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 md:hidden" />
            <ThreadItem win={win} />
          </div>
        ))}
      </div>

      {/* comments */}
      <div className="mt-14">
        <h2 className="mb-4 text-2xl font-semibold text-white">💬 Thoughts?</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Drop your thoughts on this chain..."
          className="mb-3 w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white"
        />
        <button
          onClick={submitComment}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Comment
        </button>

        <div className="mt-6 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
              <p className="text-sm text-white">{c.text}</p>
              <p className="mt-1 text-xs text-gray-500">
                ✍️ {c.username} • {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
