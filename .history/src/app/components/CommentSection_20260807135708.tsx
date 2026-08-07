// @/app/components/CommentSection.tsx
'use client'

import React, { useCallback } from 'react'
import Comment from './Comments'
import { useCommentsLogic, CommentType } from '../hooks/useCommentsLogic'
import { CommentInput } from './commentUI/CommentInput'
import { DeleteConfirmationModal } from './commentUI/DeleteConfirmationModal'

export default function CommentSection({ winId }: { winId: string }) {
  const {
    // State & Data
    newComment,
    isAuthenticated,
    currentUser,
    sort,
    apiError,
    confirmDeleteId,
    replyingTo,
    expandedComments,
    loadingReplies,
    isSubmitting,
    sortedComments,

    // Handlers
    setNewComment,
    trackEngagement,
    setSort,
    setReplyingTo,
    handlePost,
    handleVote,
    handleFlag,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleReply,
    expandReplies,
  } = useCommentsLogic({ winId })

  /**
   * Renders a comment and its direct replies.
   * Logic: If depth is 0, it's a root. If it's a root, it can show replies.
   * If it's a reply (depth 1), we don't render further nested replies.
   */
  const renderComment = useCallback(
    (comment: CommentType, depth: number = 0) => {
      const hasReplies = comment.replyCount && comment.replyCount > 0
      const isExpanded = expandedComments.has(comment.id)
      const isLoading = loadingReplies.has(comment.id)

      return (
        <div
          key={comment.id}
          onMouseEnter={() => trackEngagement(comment.id, 'hovers')}
          onClickCapture={() => trackEngagement(comment.id, 'clicks')}
        >
          {/* Main Comment Component */}
          <Comment
            comment={{
              ...comment,
              replyingTo: replyingTo?.id === comment.id ? replyingTo.username : undefined,
            }}
            currentUser={currentUser}
            onVote={handleVote}
            onFlag={handleFlag}
            onDelete={handleDelete}
            onReply={handleReply}
            depth={depth}
          />

          {/* Reply expansion button (Only for Root Comments) */}
          {depth === 0 && hasReplies && !isExpanded && (
            <button
              onClick={() => expandReplies(comment.id)}
              disabled={isLoading}
              className="ml-11 mt-1 text-blue-500 text-[12px] font-bold hover:underline disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
              )}
            </button>
          )}

          {/* Direct Replies List (Strictly Level 1) */}
          {/* Inside renderComment in CommentSection.tsx */}
        </div>
      )
    },
    [
      expandedComments,
      loadingReplies,
      replyingTo,
      currentUser,
      handleVote,
      handleFlag,
      handleDelete,
      handleReply,
      expandReplies,
      trackEngagement,
    ]
  )

  return (
    <div className="rounded-xl px-4 py-4 relative">
      {' '}
      {/* Header & Sorting */}
      <div className="flex gap-6 items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Comments {sortedComments.length > 0 && `(${sortedComments.length})`}
        </h2>
        <div className="ml-auto flex gap-2">
          {/* {(['newest', 'hottest'] as const).map((sortType) => (
            <button
              key={sortType}
              onClick={() => setSort(sortType)}
              className={`text-sm px-3 py-1 rounded-full transition ${
                sort === sortType
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
            </button>
          ))} */}
        </div>
      </div>
      <div className="mt-6">
        <CommentInput
          isAuthenticated={isAuthenticated}
          isSubmitting={isSubmitting}
          newComment={newComment}
          setNewComment={setNewComment}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          handlePost={handlePost}
        />
      </div>
      {/* Comment List */}
      <div className="mt-8 space-y-4">
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => renderComment(comment, 0))
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
      {/* Error display */}
      {apiError && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {apiError}
        </div>
      )}
      <DeleteConfirmationModal
        isVisible={!!confirmDeleteId}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
      />
    </div>
  )
}
