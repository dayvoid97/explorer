// @/app/components/CommentInput.tsx
import React from 'react'
import { ReplyState } from '@/app/hooks/useCommentsLogic'

interface CommentInputProps {
  isAuthenticated: boolean
  newComment: string
  setNewComment: (text: string) => void
  replyingTo: ReplyState | null
  setReplyingTo: (state: ReplyState | null) => void
  handlePost: () => Promise<void>
  isSubmitting: boolean
}

export const CommentInput: React.FC<CommentInputProps> = ({
  isAuthenticated,
  newComment,
  setNewComment,
  replyingTo,
  setReplyingTo,
  isSubmitting,
  handlePost,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="text-center p-6 rounded-lg ">
        <p className=" text-sm text-white dark:text-white font-medium">
          <a href="/login" className="text-xl underline">
            Log in
          </a>{' '}
          or{' '}
          <a href="/signup" className="text-xl underline">
            sign up
          </a>{' '}
          to join the conversation
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {replyingTo && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Replying to <span className="font-semibold">@{replyingTo.username}</span>
          </span>
          <button onClick={() => setReplyingTo(null)} className="text-blue-500 hover:underline">
            Cancel
          </button>
        </div>
      )}
      <div className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            replyingTo ? `Replying to @${replyingTo.username}...` : 'Write your thoughts...'
          }
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontWeight: 400,
            fontStyle: 'normal',
            letterSpacing: '-0.05rem',
          }}
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handlePost()
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to post
          </span>
          <button
            onClick={handlePost}
            disabled={!newComment.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-lg transition"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 400,
              fontStyle: 'normal',
              letterSpacing: '-0.05rem',
            }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : replyingTo ? (
              'Post Reply'
            ) : (
              'Post Comment'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
