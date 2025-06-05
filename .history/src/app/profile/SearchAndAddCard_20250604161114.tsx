'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
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
    <section className="mt-20 max-w-4xl mx-auto px-4">
      <h2 className="text-center text-3xl font-black tracking-widest mb-2">SEARCH AND ADD CARD</h2>

      <form
        onSubmit={handleSearchAndLaunch}
        className="border border-gray-300 rounded-xl p-8 space-y-6 bg-white shadow-sm"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-2xl rounded-2xl border px-6 py-6 text-center">
            <p className="font-semibold">Type to add a card</p>
            <p className="italic text-sm text-gray-600">How to be an elite soccer player?</p>
            <p className="italic text-sm text-gray-600">Strength in Consistency</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Add A Ticker"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              className="rounded-full border border-black px-6 py-3 text-center text-sm w-72"
            />

            <button
              type="submit"
              disabled={loading || !companyInput.trim()}
              className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {actionStatus && (
          <p
            className={`text-center mt-4 ${
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
