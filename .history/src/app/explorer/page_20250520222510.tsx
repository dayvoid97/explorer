'use client'
import type * as React from 'react'
import { useState, FormEvent } from 'react'
import useExplorerSearch from '../hooks/useExplorersearch'
import { ExplorerItem } from '../hooks/useExplorersearch'

export default function ExplorerPage(): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [countriesInput, setCountriesInput] = useState<string>('')

  const { search, data, loading, error } = useExplorerSearch()

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    const parsedCountries = countriesInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c !== '')

    if (!trimmedQuery && parsedCountries.length === 0) return
    search(trimmedQuery, parsedCountries)
  }

  const renderResult = (item: ExplorerItem): JSX.Element => (
    <div
      key={item.ticker}
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
  )

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🌍 Financial Gurkha Explorer</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, sectors, or keywords..."
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={countriesInput}
            onChange={(e) => setCountriesInput(e.target.value)}
            placeholder="Countries (comma-separated, e.g. Nepal, Tunisia)"
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

      {loading && <p className="text-center text-gray-500">Loading results...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {data && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(Array.isArray(data) ? data : [data]).map(renderResult)}
        </section>
      )}
    </main>
  )
}
