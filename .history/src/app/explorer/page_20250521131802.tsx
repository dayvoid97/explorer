'use client'

import type * as React from 'react'
import { useState, FormEvent } from 'react'
import useExplorerSearch from '../hooks/useExplorersearch'
import { ExplorerItem } from '../hooks/useExplorersearch'

export default function ExplorerPage(): JSX.Element {
  const [query, setQuery] = useState('')
  const [countriesInput, setCountriesInput] = useState('')
  const { search, data, loading, error } = useExplorerSearch()

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    const parsedCountries = countriesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    if (!trimmedQuery) return
    search(trimmedQuery, parsedCountries)
  }

  const renderField = (label: string, value?: string): JSX.Element | null =>
    value ? (
      <p className="text-sm text-gray-700">
        <strong>{label}:</strong> {value}
      </p>
    ) : null

  const renderResult = (item: ExplorerItem): JSX.Element => (
    <div
      key={item.ticker}
      className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900"
    >
      <h2 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">
        {item.companyName} <span className="text-gray-500">({item.ticker})</span>
      </h2>
      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
        {renderField('Exchange', item.exchange)}
        {renderField('Primary Sector', item.primarySector)}
        {renderField('Industry Group', item.industryGroup)}
        {renderField('Country', item.country)}
        {renderField('Broad Group', item.broadGroup)}
        {renderField('SIC Code', item.sicCode)}
        {renderField('Source', item.source)}
      </div>
    </div>
  )

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
      {!loading && !data && !error && (
        <p className="text-center text-gray-400">Start by entering a company name...</p>
      )}

      {data && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(Array.isArray(data) ? data : [data]).map(renderResult)}
        </section>
      )}
    </main>
  )
}
