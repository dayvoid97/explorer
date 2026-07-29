// @/app/components/DeleteConfirmationModal.tsx
import React from 'react'

interface DeleteConfirmationModalProps {
  isVisible: boolean
  confirmDelete: () => Promise<void>
  cancelDelete: () => void
}

// @/app/components/DeleteConfirmationModal.tsx
// @/app/components/commentUI/DeleteConfirmationModal.tsx
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isVisible,
  confirmDelete,
  cancelDelete,
}) => {
  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div className="animate-in zoom-in bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm duration-200">
        <h3 className="text-xl font-bold text-gray-100 mb-2">Delete Comment?</h3>
        <p className="text-gray-400 text-sm mb-6">
          This will permanently remove your comment. This cannot be undone.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={confirmDelete}
            className="w-full py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all"
          >
            Yes, Delete
          </button>
          <button
            onClick={cancelDelete}
            className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-200 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
