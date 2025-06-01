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

  // Add new result to history stack if it’s valid and not a duplicate
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
    // Future idea: push to saved state or Firebase
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        🌍 Financial Gurkha Explorer
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company name (e.g. Apple Inc.)"
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={countriesInput}
            onChange={(e) => setCountriesInput(e.target.value)}
            placeholder="Countries (comma-separated)"
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition self-center"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">🔄 Loading results...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && history.length === 0 && (
        <p className="text-center text-gray-400">Start by entering a company name...</p>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {history.map((item) => (
          <ExplorerCard key={item.ticker} item={item} onRemove={removeCard} onSave={saveCard} />
        ))}
      </section>
    </main>
  )
}
