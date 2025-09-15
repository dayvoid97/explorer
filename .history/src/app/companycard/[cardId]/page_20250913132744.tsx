'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation' // Import useRouter
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '@/app/lib/auth' // isLoggedIn for initial check
import MediaUploader from '@/app/components/MediaUploader' // Already updated
import { timeAgo } from '@/app/lib/time' // Assuming this utility is correct
import { Pencil, Save } from 'lucide-react'
import AdUnit from '@/app/components/AdUnit'
import StarButton from '@/app/components/StarButton'
import { AD_CONFIG } from '@/app/config/adConfig'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CompanyCardPage() {
  const router = useRouter() // Initialize useRouter
  const { cardId } = useParams() as { cardId: string } // Ensure cardId is string
  const [card, setCard] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)

  const [isEditingMeta, setIsEditingMeta] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editTicker, setEditTicker] = useState('')
  const [apiError, setApiError] = useState<string | null>(null) // For general API errors
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<string | null>(null) // For item deletion confirmation

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setApiError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  // Fetch Card Metadata
  useEffect(() => {
    const fetchCard = async () => {
      if (!cardId) return // Ensure cardId is available

      setLoading(true)
      setApiError(null) // Clear previous errors

      // Check if user is logged in before attempting authenticated fetch
      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to view this card.')
        setLoading(false)
        return
      }

      try {
        // CHANGED: Use authFetch for this authenticated call
        const res = await authFetch(
          `${API_BASE}/gurkha/companycard/view?cardId=${cardId}&light=true`,
          {
            headers: {
              /* authFetch adds Authorization header */
            },
          }
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(
            data.message || data.error || `Failed to fetch card metadata (Status: ${res.status})`
          )
        }
        setCard(data.card)
      } catch (err: any) {
        console.error('Failed to fetch card metadata:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setApiError(err.message || 'Failed to load card metadata.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (cardId) fetchCard()
  }, [cardId, router]) // Add router to dependencies for handleAuthRedirect

  // Update edit states when card loads/changes
  useEffect(() => {
    if (card) {
      setEditTitle(card.companyName || '')
      setEditTicker(card.cardTicker || '')
    }
  }, [card])

  // Fetch Card Items
  useEffect(() => {
    const fetchItems = async () => {
      if (!card || !cardId) return // Ensure card and cardId are available

      setLoadingItems(true)
      setApiError(null) // Clear previous errors

      // Check if user is logged in before attempting authenticated fetch (redundant if card fetch already did, but safer)
      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to view card items.')
        setLoadingItems(false)
        return
      }

      try {
        // CHANGED: Use authFetch for this authenticated call
        const res = await authFetch(`${API_BASE}/gurkha/companycard/view?cardId=${cardId}`, {
          headers: {
            /* authFetch adds Authorization header */
          },
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(
            data.message || data.error || `Failed to fetch items (Status: ${res.status})`
          )
        }
        setItems(data.card.items || [])
      } catch (err: any) {
        console.error('Failed to fetch items:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setApiError(err.message || 'Failed to load card items.')
        }
      } finally {
        setLoadingItems(false)
      }
    }

    if (card && cardId) fetchItems() // Only fetch items if card metadata is loaded
  }, [card, cardId, router]) // Depend on card, cardId, router

  // Handle Metadata Update (Save button)
  const handleUpdateMetadata = async () => {
    if (!isEditingMeta) {
      setIsEditingMeta(true) // Enter edit mode
      return
    }

    // Check if user is logged in
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to edit card metadata.')
      return
    }

    setApiError(null) // Clear previous errors

    const payload: any = { cardId }
    let changesMade = false

    if (editTitle.trim() && editTitle.trim() !== card.companyName) {
      payload.title = editTitle.trim()
      changesMade = true
    }
    if (editTicker.trim() && editTicker.trim() !== card.cardTicker) {
      payload.ticker = editTicker.trim().toUpperCase()
      changesMade = true
    }

    if (!changesMade) {
      // No actual changes, just exit edit mode
      setIsEditingMeta(false)
      return
    }

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/companycard/editMeta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to update metadata.')
      }

      setCard({
        ...card,
        companyName: payload.title || card.companyName,
        cardTicker: payload.ticker || card.cardTicker,
      })
      setIsEditingMeta(false) // Exit edit mode
    } catch (err: any) {
      console.error('Failed to update metadata:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Error updating metadata.')
      }
    }
  }

  // Handle Publish Status Toggle
  const handlePublishToggle = async () => {
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to change publish status.')
      return
    }
    setApiError(null) // Clear previous errors
    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/companycard/card/${card.cardId}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !card.isPublished }),
      })
      if (res.ok) {
        setCard({ ...card, isPublished: !card.isPublished })
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to update publish status.')
      }
    } catch (err: any) {
      console.error('Error updating publish status:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Error updating publish status.')
      }
    }
  }

  // Handle Item Publish/Draft Toggle
  const handleItemPublishToggle = async (item: any) => {
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to change item visibility.')
      return
    }
    setApiError(null) // Clear previous errors
    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/companycard/item/${item.unitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDraft: !item.isDraft }),
      })
      if (res.ok) {
        setItems(
          items.map((itm) => (itm.unitId === item.unitId ? { ...itm, isDraft: !itm.isDraft } : itm))
        )
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to toggle item visibility.')
      }
    } catch (err: any) {
      console.error('Error toggling item visibility:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Error toggling item visibility.')
      }
    }
  }

  // Handle Item Delete
  const handleItemDelete = async (item: any) => {
    if (!isLoggedIn()) {
      handleAuthRedirect('You must be logged in to delete items.')
      return
    }
    setConfirmDeleteItemId(item.unitId) // Show custom confirmation modal
  }

  const confirmDeleteItem = async () => {
    if (!confirmDeleteItemId) return
    setApiError(null) // Clear previous errors

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/companycard/item/${confirmDeleteItemId}`, {
        method: 'DELETE',
        headers: {
          /* authFetch adds Authorization header */
        },
      })
      if (res.ok) {
        setItems(items.filter((itm) => itm.unitId !== confirmDeleteItemId))
        setConfirmDeleteItemId(null) // Close modal
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to delete item.')
      }
    } catch (err: any) {
      console.error('Error deleting item:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Error deleting item.')
      }
      setConfirmDeleteItemId(null) // Close modal on error too
    }
  }

  const cancelDeleteItem = () => {
    setConfirmDeleteItemId(null)
  }

  if (loading)
    return <p className="p-4 text-center text-gray-500 dark:text-gray-400">Loading card...</p>
  if (apiError) return <p className="p-4 text-center text-red-600 dark:text-red-400">{apiError}</p>
  if (!card) return <p className="p-4 text-red-600 dark:text-red-400">Card not found</p>

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 bg-white dark:bg-gray-900 min-h-screen rounded-lg shadow">
      {' '}
      {/* Dark mode bg/shadow */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex flex-col gap-2 flex-1">
          {' '}
          {/* flex-1 to push button */}
          <input
            type="text"
            value={editTitle}
            disabled={!isEditingMeta}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Card Title"
            // Dark mode and conditional styling
            className={`px-4 py-2 rounded-xl text-xl w-full max-w-lg transition-all duration-200 border dark:border-gray-700 ${
              isEditingMeta
                ? 'bg-white dark:bg-gray-800 shadow focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
                : 'bg-transparent text-gray-900 dark:text-white cursor-default focus:ring-0 focus:border-transparent'
            }`}
          />
          <input
            type="text"
            value={editTicker}
            disabled={!isEditingMeta}
            onChange={(e) => setEditTicker(e.target.value)}
            placeholder="Ticker"
            // Dark mode and conditional styling
            className={`px-4 py-2 rounded-xl text-lg w-full max-w-xs transition-all duration-200 border dark:border-gray-700 ${
              isEditingMeta
                ? 'bg-white dark:bg-gray-800 shadow focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 cursor-default focus:ring-0 focus:border-transparent'
            }`}
          />
        </div>
        <StarButton cardId={card.cardId} initialStarred={card.isStarred || false} />

        <button
          onClick={handleUpdateMetadata} // Unified handler
          className="p-2 rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={isEditingMeta ? 'Save changes' : 'Edit'}
        >
          {isEditingMeta ? (
            <Save className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <Pencil className="w-5 h-5 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white" />
          )}
        </button>
      </div>
      {/* Publish Status + Toggle */}
      <div className="flex items-center gap-4 mb-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            card.isPublished
              ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
          }`}
        >
          {card.isPublished ? 'Published' : 'Private Draft'}
        </span>

        <button
          onClick={handlePublishToggle} // Unified handler
          className={`text-sm font-medium ${
            card.isPublished
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-green-600 dark:text-green-400'
          } hover:underline`}
        >
          {card.isPublished ? 'Make Private' : 'Publish Card'}
        </button>
      </div>
      {/* Visibility Info */}
      {card.isPublished ? (
        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-md dark:bg-green-950 dark:text-green-300 dark:border-green-800">
          <strong>Public Card:</strong> This card is publicly visible. Items marked as public inside
          this card are searchable across Financial Gurkha.
        </div>
      ) : (
        <div className="mb-6 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-md dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
          <strong>Private Card:</strong> Only you can view this card. It is not visible or
          searchable to other users.
        </div>
      )}
      {/* Card Created Date */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Created: {new Date(card.createdAt).toLocaleString()}
      </p>
      {/* MediaUploader (already updated) */}
      <div className="md:w-[320px] mb-10">
        <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm leading-relaxed">
          Add content to this card — upload <strong>text notes</strong>, <strong>tables</strong>,{' '}
          <strong>images</strong>, <strong>videos</strong>, or even{' '}
          <strong>documents and charts</strong> to help you explain key ideas, data, or insights
          about the company.
        </div>
        {/* <MediaUploader cardId={cardId as string} /> */}
      </div>
      {/* Items Section */}
      <h2 className="text-xl mt-6 mb-4 font-semibold text-gray-900 dark:text-white">Items</h2>
      {apiError && !loading && <p className="text-red-500 dark:text-red-400 text-sm">{apiError}</p>}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-3">
          {loadingItems ? (
            <p className="text-gray-500 dark:text-gray-400">Loading media...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No media items yet.</p>
          ) : (
            items.map((item: any, i: number) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-4 py-3 border dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {item.title}
                      </h3>
                      {item.externalLink && (
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-sm flex items-center gap-1 dark:text-green-400"
                        >
                          ↗ External
                        </a>
                      )}
                    </div>

                    <p className="font-italic font-semibold text-sm  mt-1 dark:text-gray-300">
                      {item.description}
                    </p>

                    <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">
                      {item.paragraphs}
                    </p>

                    <div className="flex gap-4 mt-2 text-xs text-gray-500 items-center dark:text-gray-400">
                      <span>🕒 {timeAgo(item.uploadedAt)}</span>
                      <span>👁️ {item.viewCount} views</span>
                      <span>💾 {item.saveCount} saves</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.isDraft
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      }`}
                    >
                      {item.isDraft ? 'Private' : 'Public'}
                    </span>

                    <button
                      onClick={() => handleItemPublishToggle(item)}
                      className="text-blue-600 hover:underline text-sm dark:text-blue-400"
                    >
                      {item.isDraft ? 'Make Public' : 'Make Private'}
                    </button>

                    <button
                      onClick={() => handleItemDelete(item)}
                      className="text-red-600 hover:underline text-sm dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-6">
          <AdUnit
            adSlot={AD_CONFIG.AD_SLOTS.COMPANY_CARD_SKYSCRAPER}
            winId={cardId}
            className="w-full"
            style={{
              display: 'block',
              width: '100%',
              minHeight: '600px', // Typical skyscraper height
              maxWidth: '320px',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
      {confirmDeleteItemId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Deletion
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteItem}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Delete
              </button>
              <button
                onClick={cancelDeleteItem}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
