'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
import MediaUploader from '@/app/components/MediaUploader'
import { timeAgo } from '@/app/lib/time'

export default function CompanyCardPage() {
  const { cardId } = useParams()
  const [card, setCard] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    const fetchCard = async () => {
      const token = getToken()
      try {
        const res = await fetch(`${API_BASE}/gurkha/companycard/view?cardId=${cardId}&light=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    const fetchItems = async () => {
      const token = getToken()
      try {
        const res = await fetch(`${API_BASE}/gurkha/companycard/view?cardId=${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      <h1 className="text-2xl font-bold mb-2">{card.companyName}</h1>
      <p className="text-sm text-gray-500 mb-6">Ticker: {card.cardTicker}</p>
      <div className="flex items-center gap-4 mb-4">
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

      <p className="text-sm text-gray-500 mb-2">
        Created: {new Date(card.createdAt).toLocaleString()}
      </p>
      <div className="md:w-[320px]">
        <div className="mt-8 space-y-4">
          <div className="text-muted-foreground text-sm leading-relaxed">
            Add content to this card — upload <strong>text notes</strong>, <strong>tables</strong>,
            <strong>images</strong>, <strong>videos</strong>, or even{' '}
            <strong>documents and charts</strong> to help you explain key ideas, data, or insights
            about the company.
          </div>
        </div>

        <MediaUploader cardId={cardId as string} />
      </div>

      <h2 className="text-xl mt-6 mb-4 font-semibold">Items</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Items Column */}
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5H19.5M19.5 4.5V10.5M19.5 4.5L9 15"
                            />
                          </svg>
                          External
                        </a>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 items-center">
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {timeAgo(item.uploadedAt)}
                      </span>

                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {item.viewCount} views
                      </span>

                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7"
                          />
                        </svg>
                        {item.saveCount} saves
                      </span>
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
                              method: 'PATCH',
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
                  <p className="text-muted-foreground text-sm mt-1">
                    {card.isPublished
                      ? 'This is a public card. All items that are set to be public are publicly searchable within Financial Gurkha.'
                      : 'This is a private card. Only you have access to viewing this card.'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Uploader Column */}
      </div>
    </div>
  )
}
