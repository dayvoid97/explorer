// components/QuickPostModal.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { isLoggedIn } from '../lib/auth' // Keep auth utils
import { X, ImagePlus, Link2, Send, AlertCircle, Plus } from 'lucide-react'
import { useQuickPostForm } from '../hooks/useQuickPostForm' // New Hook
import { usePostSubmit } from '../hooks/usePostSubmit' // New Hook
import { ChronologySelector } from './QuickPostChronologySelector'
import { QuickPostGuestLander } from './QuickPostLander'

interface QuickPostModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickPostModal({ isOpen, onClose }: QuickPostModalProps) {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    setIsLogged(isLoggedIn())
  }, [isOpen])

  // 1. Form and Local State Management
  const {
    formState,
    updateFormState,
    resetForm,
    processedExternalLink,
    showAdvanced,
    setShowAdvanced,
    handleMediaChange,
    removeMediaFile,
  } = useQuickPostForm()

  // Centralized close handler that performs cleanup
  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  // 2. Submission Logic
  const { uiState, handleSubmit } = usePostSubmit(
    formState,
    processedExternalLink,
    handleClose // Pass cleanup function to hook
  )
  const isTitleMissing = !formState.title.trim()
  const isContentMissing = !formState.content.trim()
  // Check if link exists, and if it does, ensure it starts with https://
  const isUrlInvalid =
    formState.externalLink.length > 0 && !formState.externalLink.startsWith('https://')

  const canSubmit = !isTitleMissing && !isContentMissing && !isUrlInvalid && !uiState.submitting

  // 3. Accessibility: Close modal on ESC key press
  useEffect(() => {
    if (!isOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  // components/QuickPostModal.tsx (Refactored UI)

  return (
    <div
      className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all"
      role="dialog"
    >
      <div className="animate-in fade-in zoom-in bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-sm font-black tracking-tighter text-white uppercase italic">
              POST A NEW DUB
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="group p-1.5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500 group-hover:text-white" />
          </button>
        </div>

        {/* Conditional Content Area */}
        <div className="overflow-y-auto">
          {isLogged ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              {/* Post Type Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateFormState('postType', 'dub')}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                    formState.postType === 'dub'
                      ? 'border-green-500 bg-green-500/10 text-white'
                      : 'border-white/5 bg-white/5 text-zinc-500'
                  }`}
                >
                  <span className="text-xl">🎯</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Major Dub</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateFormState('postType', 'intel')}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                    formState.postType === 'intel'
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-white/5 bg-white/5 text-zinc-500'
                  }`}
                >
                  <span className="text-xl">🤪</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Dilly Dally
                  </span>
                </button>
              </div>

              {/* Input Group */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => updateFormState('title', e.target.value)}
                  placeholder="Title the Dub (required)"
                  // Changed placeholder:text-zinc-800 to placeholder:text-white
                  className="w-full text-2xl font-bold bg-transparent border-0 text-white placeholder:text-white focus:ring-0 p-0"
                />
                <textarea
                  rows={3}
                  value={formState.content}
                  onChange={(e) => updateFormState('content', e.target.value)}
                  placeholder="Add a description. ( Required)"
                  // Changed placeholder:text-zinc-800 to placeholder:text-white/70 for better UX
                  className="w-full bg-transparent border-0 text-zinc-300 placeholder:text-white/70 focus:ring-0 p-0 resize-none text-lg"
                />
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5">
                    <ImagePlus className="w-5 h-5 text-zinc-400" />
                    <input type="file" multiple hidden onChange={handleMediaChange} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`p-3 rounded-2xl border ${
                      showAdvanced
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-white/5 border-white/5 text-zinc-400'
                    }`}
                  >
                    <Link2 className="w-5 h-5" />
                  </button>
                  {/* NEW CHRONOLOGY SELECTOR */}
                  <div className="  rounded-2xl">
                    <ChronologySelector
                      value={formState.chronologyId}
                      onChange={(id) => updateFormState('chronologyId', id)}
                    />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase">
                  {formState.content.length} characters
                </div>
              </div>

              {/* Advanced Area: URL Input with Warning */}
              {showAdvanced && (
                <div className="animate-in slide-in-from-top-2 space-y-3 duration-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={formState.externalLink}
                      onChange={(e) => updateFormState('externalLink', e.target.value)}
                      placeholder="Paste external link (must start with https://)"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white focus:outline-none transition-all ${
                        isUrlInvalid ? 'border-red-500/50' : 'border-white/5'
                      }`}
                    />
                    {isUrlInvalid && (
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                          Protocol Required: Link must start with https://
                        </span>
                      </div>
                    )}
                  </div>

                  {processedExternalLink && (
                    <div className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-video">
                      <img
                        src={processedExternalLink.previewImage || '/api/placeholder/400/225'}
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                          {processedExternalLink.platform} detected
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Media Preview */}
              {formState.mediaFiles.length > 0 && (
                <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                  {formState.mediaFiles.map((file, i) => (
                    <div
                      key={i}
                      className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-white/20"
                    >
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeMediaFile(i)}
                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`group w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all shadow-xl overflow-hidden ${
                  !canSubmit
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {uiState.submitting ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>
                      {isTitleMissing || isContentMissing
                        ? 'Fill Required Fields'
                        : isUrlInvalid
                        ? 'Fix HTTPS Protocol'
                        : 'Confirm Transmission'}
                    </span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <QuickPostGuestLander />
          )}
        </div>
      </div>
    </div>
  )
}

// Floating Action Button Component remains mostly the same, but with updated styling
export function QuickPostButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // We always show the button now.
  // The Modal internal logic handles whether to show the form or the lander.
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group rounded-full fixed bottom-6 right-6 w-14 h-14 bg-black/90 backdrop-blur-sm text-white shadow-lg hover:shadow-xl flex items-center justify-center z-40 transition-all duration-200 hover:scale-110 hover:bg-black active:scale-95 border border-white/10"
        aria-label="Create new post"
      >
        <Plus size={20} strokeWidth={2.5} className="transition-transform group-hover:rotate-90" />
      </button>
      <QuickPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
