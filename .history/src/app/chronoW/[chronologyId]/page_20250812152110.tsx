'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const sortedWins = useMemo(() => {
    return [...wins].sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [wins, sortOrder])

  const itemIds = useMemo(() => sortedWins.map((w) => w.id), [sortedWins])

  const submitComment = async () => {
    if (!newComment.trim()) return
    if (!isLoggedIn()) return alert('Login to comment')

    setIsSubmitting(true)
    try {
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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="border-foreground animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground animate-pulse">Loading chronology...</p>
        </div>
      </div>
    )
  }

  if (!chronology) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">📭</div>
          <h2 className="text-foreground text-2xl font-bold">Not Found</h2>
          <p className="text-muted-foreground">
            This chronology doesn't exist or has been removed.
          </p>
          <Link
            href="/chronoW"
            className="bg-foreground text-background inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            ← Back to ChronoDubs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <section className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Enhanced Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/chronoW"
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors duration-200"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to ChronoDubs
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground bg-muted/50 text-xs px-3 py-1 rounded-full">
              {new Date(chronology.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {chronology.isPrivate && (
              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded-full">
                🔒 Private
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Header */}
        <div className="relative mb-12">
          <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-gradient-to-r rounded-2xl -z-10"></div>
          <div className="border-border/50 p-8 rounded-2xl backdrop-blur-sm border">
            <h1 className="from-foreground to-muted-foreground text-4xl md:text-5xl font-black leading-tight mb-4 bg-gradient-to-r bg-clip-text text-transparent">
              {chronology.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="from-primary to-secondary w-8 h-8 bg-gradient-to-br rounded-full flex items-center justify-center text-white text-sm font-bold">
                {chronology.createdBy.charAt(0).toUpperCase()}
              </div>
              <span className="text-muted-foreground font-medium">@{chronology.createdBy}</span>
            </div>

            {chronology.description && (
              <p className="text-foreground/80 text-lg leading-relaxed mb-6 max-w-2xl">
                {chronology.description}
              </p>
            )}

            {(chronology.categories ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(chronology.categories ?? []).map((cat, i) => (
                  <span
                    key={i}
                    className="from-primary/10 to-secondary/10 text-foreground/80 border-border/50 hover:border-border bg-gradient-to-r px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Sort Controls */}
        <div className="bg-card/50 border-border/50 mb-8 flex items-center justify-between backdrop-blur-sm border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-foreground text-sm font-medium">Timeline View</span>
            <span className="text-muted-foreground bg-muted/50 text-xs px-2 py-1 rounded">
              {sortedWins.length} posts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm mr-2">Sort:</span>
            <div className="bg-muted/50 flex rounded-lg p-1">
              <button
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  sortOrder === 'asc'
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Oldest First
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  sortOrder === 'desc'
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Newest First
              </button>
            </div>
          </div>
        </div>

        {/* Progress Rail */}
        <div className="mb-8">
          <ProgressRail itemIds={itemIds} />
        </div>

        {/* Enhanced Thread */}
        <div className="relative mb-16">
          <div className="via-border absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent to-transparent hidden md:block"></div>
          <div className="space-y-8">
            {sortedWins.map((win, index) => (
              <div key={win.id} id={`win-${win.id}`} className="group relative">
                {/* Timeline Dot */}
                <div className="from-primary to-secondary border-background absolute left-4 top-3 w-4 h-4 bg-gradient-to-br rounded-full border-2 shadow-lg z-10 hidden md:block group-hover:scale-110 transition-transform duration-200"></div>

                {/* Content */}
                <div className="bg-card/50 border-border/50 hover:border-border md:ml-12 backdrop-blur-sm border rounded-xl p-6 transition-all duration-200 hover:shadow-lg">
                  <ThreadItem win={win} />
                </div>
              </div>
            ))}

            {sortedWins.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-foreground text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This chronology is just getting started. Check back soon for updates!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Comments Section */}
        <div className="bg-card/30 border-border/50 backdrop-blur-sm border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">💬</div>
            <h2 className="text-foreground text-2xl font-bold">Discussion</h2>
            <span className="text-muted-foreground bg-muted/50 text-sm px-2 py-1 rounded-full">
              {comments.length}
            </span>
          </div>

          {/* Comment Form */}
          <div className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this chronology..."
              className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary/50 w-full min-h-[120px] p-4 border rounded-xl focus:ring-2 transition-all duration-200 resize-none"
              rows={4}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-muted-foreground text-xs">
                {newComment.length}/500 characters
              </span>
              <button
                onClick={submitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="from-primary to-secondary px-6 py-2.5 bg-gradient-to-r text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="group bg-background/50 border-border/30 hover:bg-background/80 border rounded-xl p-4 transition-all duration-200"
              >
                <p className="text-foreground mb-3 leading-relaxed">{comment.text}</p>
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="from-primary to-secondary w-5 h-5 bg-gradient-to-br rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">@{comment.username}</span>
                  </div>
                  <span>•</span>
                  <time className="hover:text-foreground transition-colors">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🤔</div>
                <p className="text-muted-foreground">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
