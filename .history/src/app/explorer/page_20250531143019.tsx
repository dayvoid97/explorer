'use client'

import type * as React from 'react'
import { useRouter } from 'next/navigation'
import { useState, FormEvent, useEffect } from 'react'
import useExplorerSearch from '../hooks/useExplorersearch'
import { ExplorerItem } from '../hooks/useExplorersearch'
import Masthead from '../components/MastHead'
import { ArrowRight } from 'lucide-react' // or any icon lib you're using

export default function ExplorerPage(): JSX.Element {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [countriesInput, setCountriesInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [history, setHistory] = useState<ExplorerItem[]>([])

  const { search, data, loading, error } = useExplorerSearch()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const searchQueryParts = [
      query.trim(),
      usernameInput.trim(),
      ...countriesInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    ]

    const combinedQuery = searchQueryParts.filter(Boolean).join(',') // Compose a single string

    if (!combinedQuery) return
    await search(query.trim(), countriesInput.trim(), usernameInput.trim())
  }

  useEffect(() => {
    if (Array.isArray(data)) {
      const unique = data.filter((item) => !history.some((h) => h.cardId === item.cardId))
      if (unique.length > 0) {
        setHistory((prev) => [...unique, ...prev])
      }
    }
  }, [data])

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <Masthead />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-12 mt-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Company name or ticker (e.g. Tesla, AAPL)"
            className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            value={countriesInput}
            onChange={(e) => setCountriesInput(e.target.value)}
            placeholder="🌎 Countries (comma-separated)"
            className="w-full sm:w-1/4 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="🙋 Search by username"
            className="w-full sm:w-1/4 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="self-center px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 transition duration-200 shadow-lg"
        >
          🚀 Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">🔄 Searching...</p>}
      {error && <p className="text-center text-red-500">❌ {error}</p>}
      {!loading && history.length === 0 && (
        <p className="text-center text-gray-400 italic">
          Start by entering a company to begin exploring.
        </p>
      )}

      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {history.map((item) => (
            <div
              key={item.cardId}
              className="p-5 border rounded-xl shadow-md bg-white hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-1">
                {item.companyName} ({item.ticker})
              </h3>
              <p className="text-sm text-gray-600">
                📍 {item.country} | 📈 {item.exchange || 'N/A'}
              </p>
              <button
                onClick={() => router.push(`/company/${item.cardId}`)}
                className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                title="View card"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-sm mt-1 text-gray-500">
                👤 <strong>{item.username}</strong>
              </p>
              <p className="mt-2 text-xs text-gray-500">🧾 {item.items?.length || 0} items</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
