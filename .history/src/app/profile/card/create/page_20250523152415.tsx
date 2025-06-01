'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/app/lib/analytics'
import { getToken } from '@/app/lib/auth'

export default function CreateCardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTicker = searchParams.get('ticker') || ''
  const defaultCompany = searchParams.get('company') || ''

  const [ticker, setTicker] = useState(defaultTicker)
  const [companyName, setCompanyName] = useState(defaultCompany)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (defaultTicker && defaultCompany) {
      trackEvent('card_creation_started', {
        ticker: defaultTicker,
        companyName: defaultCompany,
      })
    }
  }, [defaultTicker, defaultCompany])

  const handleAddItem = () => {
    setItems([...items, { title: '', description: '', type: '', mimeType: '', isDraft: true }])
  }

  const handleItemChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  const handleSubmit = async () => {
    const token = getToken()
    if (!token) return router.push('/login')
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/companycard/launch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticker,
          companyName,
          items,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      trackEvent('card_created', { ticker })
      router.push('/profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-2">Create a New Company Card</h1>
      <p className="text-md text-gray-600 mb-4">
        for <strong>{companyName}</strong> ({ticker})
      </p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border p-4 rounded bg-gray-50">
            <input
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleItemChange(i, 'title', e.target.value)}
              className="w-full border px-2 py-1 rounded mb-2"
            />
            <input
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(i, 'description', e.target.value)}
              className="w-full border px-2 py-1 rounded mb-2"
            />
            <input
              placeholder="Type (e.g., image, video)"
              value={item.type}
              onChange={(e) => handleItemChange(i, 'type', e.target.value)}
              className="w-full border px-2 py-1 rounded mb-2"
            />
            <input
              placeholder="Mime Type (e.g., image/jpeg)"
              value={item.mimeType}
              onChange={(e) => handleItemChange(i, 'mimeType', e.target.value)}
              className="w-full border px-2 py-1 rounded mb-2"
            />
            <label className="text-sm flex gap-2 items-center">
              <input
                type="checkbox"
                checked={item.isDraft}
                onChange={(e) => handleItemChange(i, 'isDraft', e.target.checked)}
              />
              Draft
            </label>
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
        >
          + Add Media Item
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Card'}
      </button>
    </div>
  )
}
