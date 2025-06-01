'use client'

import { useState } from 'react'
import useExplorerSearch from '@/app/hooks/useExplorersearch'
import { ExplorerItem } from '@/app/hooks/useExplorersearch'

export default function ExplorerPage() {
  const [query, setQuery] = useState('')
  const { search, data, loading, error } = useExplorerSearch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() === '') return
    search(query)
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🌍 Financial Gurkha Explorer</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-10"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ticker or company name"
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">Loading results...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {data && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(Array.isArray(data) ? data : [data]).map((item, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-700">
                {item.companyName} <span className="text-gray-500">({item.ticker})</span>
              </h2>
              <p className="text-sm text-gray-700">
                <strong>Sector:</strong> {item.primarySector}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Region:</strong> {item.region}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Market Type:</strong> {item.marketType}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Exchange:</strong> {item.exchange}
              </p>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
