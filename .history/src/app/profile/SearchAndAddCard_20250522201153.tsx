'use client'

import React, { useState } from 'react'
import useExplorerSearch, { ExplorerItem } from '@/app/hooks/useExplorersearch'

export default function SearchAndAddCard() {
  const [query, setQuery] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const { search, data, loading, error } = useExplorerSearch()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const countries = countryInput ? countryInput.split(',').map((c) => c.trim()) : []
    await search(query, countries)
  }

  const renderCompanyCard = (item: ExplorerItem) => (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">
        {item.companyName} ({item.ticker})
      </h2>
      <p>
        <strong>Exchange:</strong> {item.exchange}
      </p>
      <p>
        <strong>Sector:</strong> {item.primarySector}
      </p>
      {item.country && (
        <p>
          <strong>Country:</strong> {item.country}
        </p>
      )}
      {item.industryGroup && (
        <p>
          <strong>Industry Group:</strong> {item.industryGroup}
        </p>
      )}
      <button
        onClick={() => alert(`Navigate to card creation for ${item.ticker}`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Card for {item.ticker}
      </button>
    </div>
  )

  return (
    <section className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Company to Add Card</h2>
      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Company name or ticker..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Optional: Countries (comma separated)"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="mt-4">
          {Array.isArray(data)
            ? data.map((item) => (
                <div key={item.ticker} className="mb-6">
                  {renderCompanyCard(item)}
                </div>
              ))
            : renderCompanyCard(data)}
        </div>
      )}
    </section>
  )
}
