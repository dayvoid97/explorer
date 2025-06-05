'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getToken } from '../lib/auth'

export default function SearchAndAddCard() {
  const router = useRouter()
  const [titleInput, setTitleInput] = useState('')
  const [tickerInput, setTickerInput] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearchAndLaunch = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = getToken()
    if (!token) {
      alert('Please log in first.')
      return
    }

    if (!titleInput.trim()) {
      setActionStatus('❌ A title is required to proceed.')
      return
    }

    setLoading(true)
    setActionStatus(null)

    const companyName = titleInput.trim()
    const ticker = tickerInput.trim().toUpperCase()
    const country = countryInput.trim()

    const payload = {
      company: {
        ticker,
        companyName,
        country,
        searchName: companyName.toLowerCase(),
        searchCountry: country.toLowerCase(),
        searchTicker: ticker.toLowerCase(),
      },
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/companycard/launch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.card?.cardId) {
        router.push(`/companycard/${data.card.cardId}`)
      } else if (res.status === 500 && data?.details?.includes('No matching company')) {
        setActionStatus(
          `❌ No matching company found. ${
            country ? 'Check country spelling or try without it.' : 'Try including a country.'
          }`
        )
      } else {
        setActionStatus(`❌ ${data.error || 'Failed to launch card.'}`)
      }
    } catch (err) {
      console.error(err)
      setActionStatus('🚨 Server error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-28 max-w-screen-md mx-auto px-6">
      <h2 className="text-center text-4xl font-extrabold tracking-tight mb-6 leading-snug">
        Search & Add a Card
      </h2>

      <form
        onSubmit={handleSearchAndLaunch}
        className="bg-white shadow-xl border border-gray-200 rounded-3xl px-8 py-10 space-y-10"
      >
        <div className="space-y-8 text-center">
          <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border rounded-2xl px-6 py-8 space-y-2">
            <input
              type="text"
              placeholder="Type to add a card"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="italic text-sm text-gray-600">How to be an elite soccer player?</p>
            <p className="italic text-sm text-gray-600">Strength in Consistency</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="text"
              placeholder="Optional: Add a ticker"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={loading || !titleInput.trim()}
              className="bg-black text-white p-4 rounded-full hover:bg-gray-900 transition disabled:opacity-50"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {actionStatus && (
          <p
            className={`text-center text-sm font-medium ${
              actionStatus.startsWith('❌') || actionStatus.startsWith('🚨')
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            {actionStatus}
          </p>
        )}
      </form>
    </section>
  )
}
