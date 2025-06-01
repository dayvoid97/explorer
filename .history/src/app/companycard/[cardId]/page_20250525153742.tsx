'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getToken } from '@/app/lib/auth'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
import MediaUploader from '@/app/components/MediaUploader'

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
    <>
      <MediaUploader cardId={cardId as string} />

      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold mb-2">{card.companyName}</h1>
        <p className="text-sm text-gray-500 mb-6">Ticker: {card.cardTicker}</p>
        <p className="text-sm text-gray-500 mb-2">
          Created: {new Date(card.createdAt).toLocaleString()}
        </p>

        <h2 className="text-xl mt-6 mb-2 font-semibold">Items</h2>
        {loadingItems ? (
          <p className="text-gray-500">Loading media...</p>
        ) : items.length === 0 ? (
          <p>No media items yet.</p>
        ) : (
          items.map((item: any, i: number) => (
            <div key={i} className="border p-3 mb-3 rounded bg-gray-50">
              <p>
                <strong>Title:</strong> {item.title}
              </p>
              <p>
                <strong>Description:</strong> {item.description}
              </p>
              <p>
                <strong>Type:</strong> {item.type}
              </p>
              <p>
                <strong>Mime Type:</strong> {item.mimeType}
              </p>
              <p>
                <strong>Draft:</strong> {item.isDraft ? 'Yes (Private)' : 'No (Public)'}
              </p>

              <div className="mt-2 flex gap-4">
                <button
                  onClick={async () => {
                    const token = getToken()
                    try {
                      const res = await fetch(
                        `${API_BASE}/gurkha/companycard/item/${item.unitId}/toggle-draft`,
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
                  className="text-blue-600 hover:underline"
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
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
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
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
