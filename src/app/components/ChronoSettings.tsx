'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChronologyManager } from '../hooks/useChronologyManager'
import {
  Edit3,
  Trash2,
  Plus,
  Save,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Search,
} from 'lucide-react'
import { authFetch } from '../lib/api'

// Define local Win type for popular wins dropdown
type WinPreview = {
  winId: string
  title: string
  upvotes?: number
  viewCount?: number
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  isLoading = false,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  isLoading?: boolean
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/80 backdrop-blur-sm duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="animate-in zoom-in-95 relative w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-6 duration-200">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <Trash2 size={24} />
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyChronologies() {
  // 1. Consume the Logic Hook
  const {
    chronologies,
    loading,
    error,
    editingId,
    formData,
    operationLoading,
    setEditingId,
    setFormData,
    deleteChrono,
    updateChrono,
    addWin,
    removeWin,
  } = useChronologyManager()

  // 2. Local UI State
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newWinId, setNewWinId] = useState('')
  const [popularWins, setPopularWins] = useState<WinPreview[]>([])
  const [fetchingPopularWins, setFetchingPopularWins] = useState(false)
  const [showPopularWins, setShowPopularWins] = useState(false)

  // Swipe Logic Refs
  const [swipingWin, setSwipingWin] = useState<string | null>(null)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const swipeStartX = useRef(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // New Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    type: 'CHRONO' | 'WIN'
    id: string // Chrono ID
    winId?: string // Optional Win ID
    title: string
  }>({ isOpen: false, type: 'CHRONO', id: '', title: '' })

  // Handle the confirmation from the modal
  const handleConfirmedDelete = async () => {
    if (deleteModal.type === 'CHRONO') {
      await deleteChrono(deleteModal.id)
    } else if (deleteModal.winId) {
      await removeWin(deleteModal.id, deleteModal.winId)
    }
    setDeleteModal({ ...deleteModal, isOpen: false })
  }

  // 3. Dropdown Logic
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPopularWins(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFetchPopular = async () => {
    setShowPopularWins(true)
    if (popularWins.length > 0) return
    setFetchingPopularWins(true)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/manage/wins/popular`
      )
      const data = await res.json()
      setPopularWins(data.wins || [])
    } catch (err) {
      console.error('Failed to load popular wins', err)
    } finally {
      setFetchingPopularWins(false)
    }
  }

  // 4. Swipe Handlers
  const onSwipeStart = (e: React.TouchEvent | React.MouseEvent, id: string) => {
    swipeStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
    setSwipingWin(id)
  }

  const onSwipeMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swipingWin) return
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = swipeStartX.current - currentX
    if (diff > 0) setSwipeDistance(Math.min(diff, 100))
  }

  const onSwipeEnd = (chronoId: string, winId: string) => {
    if (swipeDistance > 80) {
      removeWin(chronoId, winId)
    }
    setSwipingWin(null)
    setSwipeDistance(0)
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 font-mono text-sm">HYDRATING CHRONOLOGIES...</p>
      </div>
    )

  if (error)
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500">
        <p className="font-bold">Fetch Error</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Chronology Management</h1>
        <p className="text-gray-400">Curate your winning streaks and manage your trading dubs.</p>
      </header>

      {/* Confirmation Modal Instance */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.type === 'CHRONO' ? 'Delete Chronology' : 'Remove Item'}
        message={
          deleteModal.type === 'CHRONO'
            ? `Are you sure you want to delete "${deleteModal.title}"? This action is permanent and will remove all references in your profile and win documents.`
            : `Remove this item from the sequence? It will stay in your Win list but will no longer be part of this chronology.`
        }
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmedDelete}
        isLoading={operationLoading?.includes('delete')}
      />

      <div className="space-y-4">
        {chronologies.map((chrono) => (
          <div
            key={chrono.id}
            className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
          >
            {editingId === chrono.id ? (
              /* --- EDIT MODE --- */
              <div className="p-6 space-y-4 bg-white/5">
                <input
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Chronology Title"
                />
                <textarea
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this collection..."
                  rows={3}
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateChrono(chrono.id)}
                    className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2"
                  >
                    {operationLoading === `edit-${chrono.id}` ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* --- VIEW MODE --- */
              <>
                <div className="group p-5 flex items-center justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === chrono.id ? null : chrono.id)}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {chrono.name}
                      </h3>
                      {expandedId === chrono.id ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {chrono.description || 'No description provided.'}
                    </p>
                    <div className="flex gap-4 mt-3 text-[10px] font-mono uppercase tracking-widest text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {chrono.wins?.length || 0} ITEMS
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(chrono.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(chrono.id)
                        setFormData(chrono)
                      }}
                      className="p-2.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: 'CHRONO',
                          id: chrono.id,
                          title: chrono.name,
                        })
                      }
                      className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      {operationLoading === `delete-${chrono.id}` ? (
                        <span className="animate-spin block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* --- EXPANDED MANAGEMENT --- */}
                {expandedId === chrono.id && (
                  <div className="animate-in slide-in-from-top-2 border-t border-white/5 bg-black/20 p-5 space-y-6 duration-200">
                    {/* Add Win Input */}
                    <div className="relative" ref={dropdownRef}>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 " size={16} />
                          <input
                            className="w-full bg-[#fff] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Search your wins or paste Win ID..."
                            value={newWinId}
                            onFocus={handleFetchPopular}
                            onChange={(e) => setNewWinId(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => {
                            addWin(chrono.id, newWinId)
                            setNewWinId('')
                          }}
                          disabled={!newWinId}
                          className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 disabled:opacity-50 transition-all"
                        >
                          ADD WIN
                        </button>
                      </div>

                      {showPopularWins && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                          {fetchingPopularWins ? (
                            <div className="p-4 text-center text-xs text-gray-500 animate-pulse">
                              SEARCHING WINS...
                            </div>
                          ) : (
                            popularWins.map((win) => (
                              <div
                                key={win.winId}
                                className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                                onClick={() => {
                                  setNewWinId(win.winId)
                                  setShowPopularWins(false)
                                }}
                              >
                                <p className="text-sm font-medium text-white">{win.title}</p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                                  ID: {win.winId} • {win.upvotes || 0} UPVOTES
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Wins List */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">
                        Current Sequence
                      </h4>
                      {chrono.wins?.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-gray-600 text-sm">
                          Empty Chronology. Add your first win above.
                        </div>
                      ) : (
                        chrono.wins?.map((win: any) => (
                          <div
                            key={win.id}
                            className="group relative bg-[#1c1c1c] border border-white/5 rounded-xl overflow-hidden touch-none"
                            onMouseDown={(e) => onSwipeStart(e, win.id)}
                            onMouseMove={onSwipeMove}
                            onMouseUp={() => onSwipeEnd(chrono.id, win.id)}
                            onTouchStart={(e) => onSwipeStart(e, win.id)}
                            onTouchMove={onSwipeMove}
                            onTouchEnd={() => onSwipeEnd(chrono.id, win.id)}
                          >
                            <div
                              className="p-4 flex items-center justify-between bg-[#1c1c1c] relative z-10 transition-transform duration-200"
                              style={{
                                transform:
                                  swipingWin === win.id
                                    ? `translateX(-${swipeDistance}px)`
                                    : 'translateX(0)',
                              }}
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-200">
                                  {win.title || 'Untitled Win'}
                                </p>
                                <p className="text-[10px] text-gray-600 mt-1">
                                  Added {new Date(win.addedAt || Date.now()).toLocaleDateString()}
                                </p>
                              </div>
                              <Trash2
                                size={14}
                                className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                            {/* Swipe Background */}
                            <div className="absolute inset-0 bg-red-600 flex items-center justify-end px-6">
                              <span className="text-white text-xs font-bold uppercase tracking-tighter">
                                Remove
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
