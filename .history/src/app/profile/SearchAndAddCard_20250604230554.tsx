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
      setActionStatus('❌ A title is required.')
      return
    }

    setLoading(true)
    setActionStatus(null)

    const payload = {
      company: {
        companyName: titleInput.trim(),
        ticker: tickerInput.trim().toUpperCase(),
        searchTitle: titleInput.trim().toLowerCase(),
        searchTicker: tickerInput.trim().toLowerCase(),
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
      } else {
        setActionStatus(`❌ ${data.error || 'Could not launch card'}`)
      }
    } catch (err) {
      console.error(err)
      setActionStatus('🚨 Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-screen-md mx-auto px-6">
      <h2 className=" text-center text-4xl font-extrabold tracking-tight mb-6 leading-snug">
        Search & Add a Card
      </h2>

      <form onSubmit={handleSearchAndLaunch} className=" border rounded">
        <div className="space-y-8 text-center">
          <div className=" py-10 rounded-2xl space-y-2">
            <input
              type="text"
              placeholder="Type to add a card"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm w-72 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <br />
            <input
              type="text"
              placeholder="Optional: Add a ticker"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="italic text-sm ">How to be an elite soccer player?</p>
            <p className="italic text-sm ">Strength in Consistency</p>
          </div>

          <div className="">
            <button
              type="submit"
              disabled={loading || !titleInput.trim()}
              className="bg-black text-white p-4 rounded-full hover:bg-gray-900 transition disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
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
