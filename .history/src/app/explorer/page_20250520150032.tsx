'use client'
import { useState } from 'react'
import useExplorerSearch from '@/hooks/useExplorerSearch'

export default function ExplorerPage() {
  const [query, setQuery] = useState('')
  const { search, data, loading, error } = useExplorerSearch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    search(query)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-semibold mb-4">Explore Equities</h1>
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Search by ticker or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      {loading && <p className="mt-6">Loading...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}
      {data && (
        <div className="mt-8 space-y-4">
          {Array.isArray(data) ? (
            data.map((item, i) => (
              <div key={i} className="p-4 border rounded shadow">
                <h2 className="font-bold text-xl">
                  {item.companyName} ({item.ticker})
                </h2>
                <p className="text-sm text-gray-600">
                  Sector: {item.primarySector} | Region: {item.region}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 border rounded shadow">
              <h2 className="font-bold text-xl">
                {data.companyName} ({data.ticker})
              </h2>
              <p className="text-sm text-gray-600">
                Sector: {data.primarySector} | Region: {data.region}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
