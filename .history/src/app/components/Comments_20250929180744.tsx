'use client'

import React, { useState } from 'react'
import {
  Heart,
  Flag,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useHeatmapTracker } from '../hooks/useHeatMapTracker'

interface CommentProps {
  comment: {
    id: string
    username: string
    text: string
    createdAt: number
    upvotes: number
    upvotedByCurrentUser?: boolean
    pfp?: string
    ownerId: string
    parentId?: string
    replies?: CommentProps['comment'][]
    replyingTo?: string // Username being replied to
  }
  currentUser: string
  onUpvote: (commentId: string) => void
  onFlag: (commentId: string) => void
  onDelete: (commentId: string) => void
  onReply: (commentId: string, username: string) => void
  depth?: number // Track nesting depth
  isLast?: boolean // For threading lines
}

export default function Comment({
  comment,
  currentUser,
  onUpvote,
  onFlag,
  onDelete,
  onReply,
  depth = 0,
  isLast = false,
}: CommentProps) {
  const router = useRouter()
  // const { onMouseEnter, onClick } = useHeatmapTracker(comment.id)

  const [isUpvoted, setIsUpvoted] = useState(comment.upvotedByCurrentUser ?? false)
  const [showActions, setShowActions] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  const maxDepth = 4
  const isNested = depth > 0
  const shouldFlatten = depth >= maxDepth

  const handleUpvote = () => {
    if (!isUpvoted) {
      setIsUpvoted(true)
      onUpvote(comment.id)
    }
  }

  const handleProfileClick = () => {
    router.push(`/publicprofile/${comment.username}`)
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const getIndentationStyle = () => {
    if (depth === 0) return {}

    const baseIndent = Math.min(depth, maxDepth) * 20
    return {
      marginLeft: `${baseIndent}px`,
      paddingLeft: `${Math.min(depth, 3) * 8}px`,
    }
  }

  const getThreadingClasses = () => {
    if (depth === 0) return ''

    const baseClasses = 'relative'
    const borderClasses = depth <= 3 ? 'border-l-2 border-gray-200 dark:border-gray-700 ' : ''

    return `${baseClasses} ${borderClasses}`
  }

  return (
    <div className={getThreadingClasses()} style={getIndentationStyle()}>
      {/* Threading line connector for nested comments */}
      {isNested && depth <= 3 && (
        <div className="absolute left-0 top-0 w-2 h-6 border-b-2 border-gray-200 dark:border-gray-700" />
      )}

      <article
        className={`rounded-xl p-2 transition hover:shadow-sm ${isNested ? 'mt-2' : 'mb-4'} ${
          depth >= maxDepth ? 'bg-gray-50 dark:bg-gray-900/50' : ''
        }`}
      >
        {/* Depth indicator for deeply nested comments */}
        {depth >= maxDepth && (
          <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>Deeply nested reply</span>
          </div>
        )}

        {/* Reply indicator */}
        {comment.replyingTo && (
          <div className="mb-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>Replying to @{comment.replyingTo}</span>
          </div>
        )}

        {/* Header */}
        <div className=" justify-between items-start">
          <div className="flex items-center gap-3">
            <div onClick={handleProfileClick} className="cursor-pointer">
              {comment.pfp ? (
                <img
                  src={comment.pfp}
                  alt={`@${comment.username}`}
                  className={`rounded-full object-cover ${depth >= 2 ? 'w-7 h-7' : 'w-9 h-9'}`}
                />
              ) : (
                <div
                  className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ${
                    depth >= 2 ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
                  }`}
                >
                  {comment.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className={`font-bold text-[#161616]  ${depth >= 2 ? 'text-xs' : 'text-sm'}`}>
                @{comment.username}
              </p>
              <p
                className={`text-gray-500 dark:text-gray-400 ${depth >= 2 ? 'text-xs' : 'text-xs'}`}
              >
                {formatTimeAgo(comment.createdAt)}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(!showActions)
              }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                {comment.username !== currentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onReply(comment.id, comment.username)
                      setShowActions(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MessageSquare className="inline-block mr-2 w-4 h-4" /> Reply
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFlag(comment.id)
                    setShowActions(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Flag className="inline-block mr-2 w-4 h-4" /> Report
                </button>
                {comment.username === currentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(comment.id)
                      setShowActions(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="inline-block mr-2 w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <p
          className={`mt-3 text-gray-800 dark:text-gray-200 leading-relaxed ${
            depth >= 2 ? 'text-xs' : 'text-sm'
          }`}
        >
          {comment.text}
        </p>

        {/* Footer */}
        <div
          className={`mt-4 flex items-center gap-4 text-gray-500 dark:text-gray-400 ${
            depth >= 2 ? 'text-xs' : 'text-sm'
          }`}
        >
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${
              isUpvoted
                ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
            <span>{comment.upvotes + (isUpvoted ? 1 : 0)}</span>
          </button>

          {/* Reply count and toggle for nested comments */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {showReplies ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            </button>
          )}

          <span className="ml-auto text-xs">💬 Active</span>
        </div>
      </article>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && showReplies && (
        <div className="mt-2">
          {comment.replies.map((reply, index) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onUpvote={onUpvote}
              onFlag={onFlag}
              onDelete={onDelete}
              onReply={onReply}
              depth={shouldFlatten ? depth : depth + 1}
              isLast={index === comment.replies!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
