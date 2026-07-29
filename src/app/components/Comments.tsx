'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CommentActions } from './commentUI/CommentAction'

interface CommentProps {
  comment: {
    id: string
    username: string
    text: string
    createdAt: number
    upvotes: number
    voters?: Record<string, number>
    pfp?: string
    ownerId: string
    parentId?: string
    replies?: any[]
    replyingTo?: string
  }
  currentUser: string
  onVote: (commentId: string, voteValue: 1 | -1) => void
  onFlag: (commentId: string) => void
  onDelete: (commentId: string) => void
  onReply: (commentId: string, username: string, parentId: string) => void
  depth?: number
  isLast?: boolean
}

export default function Comment({
  comment,
  currentUser,
  onVote,
  onFlag,
  onDelete,
  onReply,
  depth = 0,
  isLast = false,
}: CommentProps) {
  const router = useRouter()
  const [showActions, setShowActions] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const userVote = comment.voters?.[currentUser] || 0

  // 🟢 Logic: If it's a root comment (no parentId), any reply to it uses this comment's ID as the parent.
  // If it's already a reply (has parentId), any reply to it uses that same parentId to keep it at Level 1.
  const effectiveParentId = comment.parentId || comment.id

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="w-full">
      <article className="py-2">
        <div className="flex gap-3">
          {/* Left: PFP Column */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              onClick={() => router.push(`/publicprofile/${comment.username}`)}
              className="cursor-pointer w-8 h-8 rounded-full overflow-hidden"
            >
              {comment.pfp ? (
                <img
                  src={comment.pfp}
                  alt={comment.username}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-gray-100 text-sm truncate">
                  @{comment.username}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>

              <CommentActions
                commentId={comment.id}
                commentUsername={comment.username}
                commentParentId={effectiveParentId} // 👈 Use effectiveParentId
                currentUser={currentUser}
                showActions={showActions}
                setShowActions={setShowActions}
                onReply={onReply}
                onFlag={onFlag}
                onDelete={onDelete}
              />
            </div>

            <div className="mt-0.5 text-gray-300 text-[13px] leading-relaxed">
              {comment.replyingTo && (
                <span className="text-blue-400 mr-1">@{comment.replyingTo}</span>
              )}
              {comment.text}
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center bg-gray-900 rounded-md border border-gray-800">
                <button
                  onClick={() => onVote(comment.id, 1)}
                  className={`p-1 ${userVote === 1 ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold px-1 text-gray-300">{comment.upvotes}</span>
                <button
                  onClick={() => onVote(comment.id, -1)}
                  className={`p-1 ${userVote === -1 ? 'text-blue-500' : 'text-gray-500'}`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onReply(comment.id, comment.username, effectiveParentId)} // 👈 Use effectiveParentId
                className="text-[11px] text-gray-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
              >
                <MessageSquare className="w-3 h-3" /> Reply
              </button>

              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-[11px] text-blue-400 font-bold hover:underline"
                >
                  {showReplies ? 'Hide' : `Show ${comment.replies.length} replies`}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* 🧵 REPLIES CONTAINER (Depth restricted to 1 by render logic in Section) */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800 transition-all">
          {comment.replies.map((reply, index) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onVote={onVote}
              onFlag={onFlag}
              onDelete={onDelete}
              onReply={onReply}
              depth={depth + 1}
              isLast={index === comment.replies!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
