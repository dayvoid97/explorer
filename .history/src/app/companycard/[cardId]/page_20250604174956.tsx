'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'
import MediaUploader from '@/app/components/MediaUploader'
import { timeAgo } from '@/app/lib/time'
import { Pencil, Save } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CompanyCardPage() {
  const { cardId } = useParams()
  const [card, setCard] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)

  const [isEditingMeta, setIsEditingMeta] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editTicker, setEditTicker] = useState('')

  useEffect(() => {
    const fetchCard = async () => {
      const token = getToken()
      try {
        const res = await fetch(`${API_BASE}/gurkha/companycard/view?cardId=${cardId}&light=true`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setCard(data.card)
      } catch (err) {
        console.error('Failed to fetch card metadata', err)
      } finally {
        setLoading(false)
      }
    }

    if (cardId) fetchCard()
  }, [cardId])

  useEffect(() => {
    if (card) {
      setEditTitle(card.companyName || '')
      setEditTicker(card.cardTicker || '')
    }
  }, [card])

  useEffect(() => {
    const fetchItems = async () => {
      const token = getToken()
      try {
        const res = await fetch(`${API_BASE}/gurkha/companycard/view?cardId=${cardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setItems(data.card.items || [])
      } catch (err) {
        console.error('Failed to fetch items', err)
      } finally {
        setLoadingItems(false)
      }
    }

    if (card && cardId) fetchItems()
  }, [card, cardId])

  if (loading) return <p className="p-4">Loading card...</p>
  if (!card) return <p className="p-4 text-red-600">Card not found</p>

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      {/* Editable Title + Ticker Block */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editTitle}
            disabled={!isEditingMeta}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Card Title"
            className={` px-4 py-2 rounded-xl text-sm w-64 transition-all duration-200 ${
              isEditingMeta
                ? 'bg-white shadow focus:ring-2 focus:ring-blue-500'
                : 'text-xl cursor-default'
            }`}
          />
          <input
            type="text"
            value={editTicker}
            disabled={!isEditingMeta}
            onChange={(e) => setEditTicker(e.target.value)}
            placeholder="Ticker"
            className={`  px-4 py-2 rounded-xl text-sm w-40 transition-all duration-200 ${
              isEditingMeta
                ? 'bg-white shadow focus:ring-2 focus:ring-blue-500'
                : ' text-l cursor-default'
            }`}
          />
          <button
            onClick={async () => {
              if (!isEditingMeta) {
                setIsEditingMeta(true)
                return
              }

              const token = getToken()
              try {
                const payload: any = {}
                if (editTitle.trim() && editTitle.trim() !== card.companyName)
                  payload.title = editTitle.trim()
                if (editTicker.trim() && editTicker.trim() !== card.cardTicker)
                  payload.ticker = editTicker.trim().toUpperCase()

                if (Object.keys(payload).length === 0) {
                  alert('No changes made.')
                  setIsEditingMeta(false)
                  return
                }

                payload.cardId = card.cardId

                const res = await fetch(`${API_BASE}/gurkha/companycard/editMeta`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                })

                const data = await res.json()
                if (res.ok) {
                  setCard({ ...card, ...payload })
                  setIsEditingMeta(false)
                } else {
                  alert(data.error || 'Failed to update metadata')
                }
              } catch (err) {
                console.error('Failed to update metadata:', err)
                alert('Error updating metadata')
              }
            }}
            className="p-2 hover:scale-110 transition-transform"
            title={isEditingMeta ? 'Save changes' : 'Edit'}
          >
            {isEditingMeta ? (
              <Save className="w-8 h-8 text-green-600" />
            ) : (
              <Pencil className="w-5 h-5 text-gray-600 hover:text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Publish Status + Toggle */}
      <div className="flex items-center gap-4 mb-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            card.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {card.isPublished ? 'Published' : 'Private Draft'}
        </span>

        <button
          onClick={async () => {
            const token = getToken()
            try {
              const res = await fetch(
                `${API_BASE}/gurkha/companycard/card/${card.cardId}/publish`,
                {
                  method: 'PUT',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ isPublished: !card.isPublished }),
                }
              )
              if (res.ok) {
                setCard({ ...card, isPublished: !card.isPublished })
              } else {
                console.error('Failed to update publish status')
              }
            } catch (err) {
              console.error('Error updating publish status:', err)
            }
          }}
          className={`text-sm font-medium ${
            card.isPublished ? 'text-yellow-600' : 'text-green-600'
          } hover:underline`}
        >
          {card.isPublished ? 'Make Private' : 'Publish Card'}
        </button>
      </div>

      {/* Visibility Info */}

      {/* Visibility Info */}
      {card.isPublished ? (
        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-md">
          <strong>Public Card:</strong> This card is publicly visible. Items marked as public inside
          this card are searchable across Financial Gurkha.
        </div>
      ) : (
        <div className="mb-6 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-md">
          <strong>Private Card:</strong> Only you can view this card. It is not visible or
          searchable to other users.
        </div>
      )}

      {/* Card Created Date */}
      <p className="text-sm text-gray-500 mb-4">
        Created: {new Date(card.createdAt).toLocaleString()}
      </p>

      {/* MediaUploader */}
      <div className="md:w-[320px] mb-10">
        <div className="text-muted-foreground mb-4 text-sm leading-relaxed">
          Add content to this card — upload <strong>text notes</strong>, <strong>tables</strong>,{' '}
          <strong>images</strong>, <strong>videos</strong>, or even{' '}
          <strong>documents and charts</strong> to help you explain key ideas, data, or insights
          about the company.
        </div>
        <MediaUploader cardId={cardId as string} />
      </div>

      {/* Items Section */}
      <h2 className="text-xl mt-6 mb-4 font-semibold">Items</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-3">
          {loadingItems ? (
            <p className="text-gray-500">Loading media...</p>
          ) : items.length === 0 ? (
            <p>No media items yet.</p>
          ) : (
            items.map((item: any, i: number) => (
              <div key={i} className="bg-white rounded-lg shadow-sm px-4 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      {item.externalLink && (
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-sm flex items-center gap-1"
                        >
                          ↗ External
                        </a>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>

                    <div className="flex gap-4 mt-2 text-xs text-gray-500 items-center">
                      <span>🕒 {timeAgo(item.uploadedAt)}</span>
                      <span>👁️ {item.viewCount} views</span>
                      <span>💾 {item.saveCount} saves</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.isDraft
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.isDraft ? 'Private' : 'Public'}
                    </span>

                    <button
                      onClick={async () => {
                        const token = getToken()
                        try {
                          const res = await fetch(
                            `${API_BASE}/gurkha/companycard/item/${item.unitId}`,
                            {
                              method: 'PUT',
                              headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ isDraft: !item.isDraft }),
                            }
                          )
                          if (res.ok) {
                            const updated = items.map((itm) =>
                              itm.unitId === item.unitId ? { ...itm, isDraft: !itm.isDraft } : itm
                            )
                            setItems(updated)
                          } else {
                            console.error('Failed to toggle draft')
                          }
                        } catch (err) {
                          console.error('Error toggling draft status:', err)
                        }
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {item.isDraft ? 'Make Public' : 'Make Private'}
                    </button>

                    <button
                      onClick={async () => {
                        const confirmed = confirm('Are you sure you want to delete this item?')
                        if (!confirmed) return

                        const token = getToken()
                        try {
                          const res = await fetch(
                            `${API_BASE}/gurkha/companycard/item/${item.unitId}`,
                            {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          )
                          if (res.ok) {
                            setItems(items.filter((itm) => itm.unitId !== item.unitId))
                          } else {
                            console.error('Failed to delete item')
                          }
                        } catch (err) {
                          console.error('Error deleting item:', err)
                        }
                      }}
                      className="text-red-600 hover:underline text-sm"
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
    </div>
  )
}
