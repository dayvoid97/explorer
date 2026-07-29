// @/app/components/commentUI/CommentAction.tsx
import React from 'react'
import { Flag, Trash2, MessageSquare, MoreHorizontal, UserPlus } from 'lucide-react'

interface CommentActionsProps {
  commentId: string
  commentUsername: string
  commentParentId?: string // 🟢 Made optional to match CommentType
  currentUser: string
  showActions: boolean
  setShowActions: (show: boolean) => void
  onReply: (commentId: string, username: string, parentId: string) => void
  onFlag: (commentId: string) => void
  onDelete: (commentId: string) => void
}

// @/app/components/commentUI/CommentAction.tsx
export const CommentActions: React.FC<CommentActionsProps> = ({
  commentId,
  commentUsername,
  commentParentId,
  currentUser,
  showActions,
  setShowActions,
  onReply,
  onFlag,
  onDelete,
}) => {
  const isAuthenticated = !!currentUser
  const isOwner = isAuthenticated && commentUsername === currentUser

  // Use a helper to prevent the click from "bleeding" into the comment container
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // 🟢 CRITICAL: Prevents triggering engagement tracks or navigation
    setShowActions(!showActions)
  }

  const handleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    action()
    setShowActions(false)
  }

  return (
    <div className="relative inline-block">
      {' '}
      {/* 🟢 Ensure inline-block for proper positioning */}
      <button
        onClick={toggleMenu}
        className="p-1.5 rounded-full text-gray-500 hover:text-gray-100 hover:bg-gray-800 transition-all z-10"
        aria-label="Comment actions"
      >
        <MoreHorizontal className="w-5 h-5" />{' '}
        {/* 🟢 Slightly larger for better mobile tap target */}
      </button>
      {showActions && (
        <>
          {/* 🟢 Transparent "Click-away" overlay to close menu when clicking outside */}
          <div className="fixed inset-0 z-[90]" onClick={() => setShowActions(false)} />

          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[100] overflow-hidden">
            {!isAuthenticated ? (
              <button
                onClick={handleAction(() => (window.location.href = '/login'))}
                className="w-full text-left px-4 py-3 text-sm text-blue-400 hover:bg-gray-800 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Sign up to interact
              </button>
            ) : (
              <div className="flex flex-col">
                {/* Reply, Report, Delete buttons here as previously defined */}
                <button
                  onClick={handleAction(() => onFlag(commentId))}
                  className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 flex items-center gap-2 border-b border-gray-800"
                >
                  <Flag className="w-4 h-4 text-yellow-500" /> Report
                </button>
                {isOwner && (
                  <button
                    onClick={handleAction(() => onDelete(commentId))}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-900/30 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
