'use client'

import type * as React from 'react'
import { useRouter } from 'next/navigation'
import { useState, FormEvent, useEffect } from 'react'
import useExplorerSearch from '../hooks/useExplorersearch'
import { ExplorerItem } from '../hooks/useExplorersearch'
import Masthead from '../components/MastHead'
import { ArrowRight } from 'lucide-react' // or any icon lib you're using
import CardItem from '../components/CardItem'
import WinCard from '../components/WinCard'
import { CardItemProps, WinItemProps } from '../hooks/useExplorersearch'

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
      <div className="flex flex-col items-center  px-4 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-xl">
          {/* TITLE INPUT */}
          <div className="w-full flex justify-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 ENTER THE TITLE"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* CATEGORY + USERNAME INPUTS */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={countriesInput}
              onChange={(e) => setCountriesInput(e.target.value)}
              placeholder="CATEGORIES"
              className="w-full sm:w-1/2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="🙋 @kanchan"
              className="w-full sm:w-1/2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* SEARCH BUTTON */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 transition duration-200 shadow-lg"
            >
              🚀 Search
            </button>
          </div>
        </form>
      </div>

      {loading && <p className="text-center text-gray-500">🔄 Searching...</p>}
      {error && <p className="text-center text-red-500">❌ {error}</p>}
      {!loading && history.length === 0 && (
        <p className="text-center  italic">
          Search by a title or tags. Search by username if you know the writer. It's that simple!
        </p>
      )}

      {!loading && history.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) =>
            item.type === 'card' ? (
              <CardItem key={item.cardId} card={item} />
            ) : (
              <WinCard key={item.id} win={item} />
            )
          )}
        </div>
      )}
    </main>
  )
}
