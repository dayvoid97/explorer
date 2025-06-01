'use client'

import type * as React from 'react'
import { useState, FormEvent, useEffect } from 'react'
import useExplorerSearch from '../hooks/useExplorersearch'
import { ExplorerItem } from '../hooks/useExplorersearch'
import ExplorerCard from '../components/ExplorerCard'

export default function ExplorerPage(): JSX.Element {
  const [query, setQuery] = useState('')
  const [countriesInput, setCountriesInput] = useState('')
  const [history, setHistory] = useState<ExplorerItem[]>([])

  const { search, data, loading, error } = useExplorerSearch()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    const parsedCountries = countriesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    if (!trimmedQuery) return
    await search(trimmedQuery, parsedCountries)
  }

  useEffect(() => {
    if (data && !Array.isArray(data)) {
      const alreadyExists = history.some((item) => item.ticker === data.ticker)
      if (!alreadyExists) {
        setHistory((prev) => [data, ...prev])
      }
    }
  }, [data])

  const removeCard = (ticker: string) => {
    setHistory((prev) => prev.filter((item) => item.ticker !== ticker))
  }

  const saveCard = (item: ExplorerItem) => {
    alert(`✅ You saved: ${item.companyName}`)
  }

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-gradient text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Financial Gurkha Explorer
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search company name (e.g. Tesla, Alibaba)"
            className="w-full sm:w-2/3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="text"
            value={countriesInput}
            onChange={(e) => setCountriesInput(e.target.value)}
            placeholder="🌎 Countries (comma-separated)"
            className="w-full sm:w-1/3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="self-center px-8 py-3 text-lg font-semibold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition duration-200 shadow-md"
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <ExplorerCard key={item.ticker} item={item} onRemove={removeCard} onSave={saveCard} />
        ))}
      </section>
    </main>
  )
}
