'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '../lib/auth'

export default function SearchAndAddCard() {
  const router = useRouter()
  const [companyInput, setCompanyInput] = useState('')
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

    if (!companyInput.trim()) {
      setActionStatus('Company name or ticker required.')
      return
    }

    setLoading(true)
    setActionStatus(null)

    const companyName = companyInput.trim()
    const ticker = companyInput.trim().toUpperCase()
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
    <section className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search And Add A Card</h2>

      <form onSubmit={handleSearchAndLaunch} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Add a title ..."
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Optional: Country (e.g., United States)"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading || !companyInput.trim()}
        >
          {loading ? 'Launching...' : 'Launch Card'}
        </button>
      </form>

      {actionStatus && (
        <p
          className={`text-center mt-2 ${
            actionStatus.startsWith('❌') || actionStatus.startsWith('🚨')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {actionStatus}
        </p>
      )}
    </section>
  )
}
