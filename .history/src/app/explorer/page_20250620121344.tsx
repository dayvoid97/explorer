'use client'

import React, { useState, useEffect, useMemo, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import useExplorerSearch, { ExplorerItem } from '../hooks/useExplorersearch'
import Masthead from '../components/MastHead'
import { ArrowRight } from 'lucide-react'
import CardItem from '../components/CardItem'
import WinCard from '../components/WinCard'
import AdUnit from '../components/AdUnit'

const TABS = ['Cards', 'Wins']

export default function ExplorerPage(): JSX.Element {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [countriesInput, setCountriesInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [history, setHistory] = useState<ExplorerItem[]>([])
  const [selectedTab, setSelectedTab] = useState('Cards')

  const { search, data, loading, error } = useExplorerSearch()

  const adIndex = useMemo(() => {
    return history.length > 5 ? Math.floor(Math.random() * (history.length - 2)) + 3 : null
  }, [history])

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

    const combinedQuery = searchQueryParts.filter(Boolean).join(',')
    if (!combinedQuery) return

    await search(query.trim(), countriesInput.trim(), usernameInput.trim())
  }

  useEffect(() => {
    if (Array.isArray(data)) {
      const unique = data.filter((item) => !history.some((h) => h.id === item.id))
      if (unique.length > 0) {
        setHistory((prev) => [...unique, ...prev])
      }
    }
  }, [data])

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <Masthead />

      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold">
          Explore the{' '}
          <span className="bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text">
            Gurkha Archive
          </span>
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Search by title, tag, or username. Discover powerful insights from real investors.
        </p>
        <p className="mt-2 text-sm text-gray-500 italic">
          Try searching for <span className="font-medium">Tesla</span> or{' '}
          <span className="font-medium">@kanchan</span>
        </p>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 max-w-3xl mx-auto">
        <div>
          <label className="block text-sm font-medium mb-1">🔍 Title or Keywords</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g. Tesla thesis, market insight"
            className="w-full px-4 py-3 border rounded-xl dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-[1.02]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">🏷 Categories</label>
            <input
              type="text"
              value={countriesInput}
              onChange={(e) => setCountriesInput(e.target.value)}
              placeholder="e.g. Crypto, Macro"
              className="w-full px-4 py-3 border rounded-xl dark:bg-neutral-900 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">🙋 Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="@kanchan"
              className="w-full px-4 py-3 border rounded-xl dark:bg-neutral-900 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition shadow-md"
          >
            🚀 Search Now
          </button>
        </div>
      </form>

      <div className="mt-10 flex justify-center gap-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-full border ${
              selectedTab === tab
                ? 'bg-black text-white'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="mt-16">
        {loading && <p className="text-center text-gray-500">🔄 Searching...</p>}
        {error && <p className="text-center text-red-500">❌ {error}</p>}
        {!loading && history.length === 0 && (
          <p className="text-center italic text-gray-500 mt-10">
            Try searching with different tags or usernames to discover insights!
          </p>
        )}

        {!loading && history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => {
              if (selectedTab === 'Cards' && item.type !== 'card') return null
              if (selectedTab === 'Wins' && item.type !== 'win') return null

              return (
                <React.Fragment key={item.id}>
                  {adIndex === index && <AdUnit />}
                  {item.type === 'card' && <CardItem card={item} />}
                  {item.type === 'win' && <WinCard win={item} />}
                  {/* Add chart rendering later */}
                </React.Fragment>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
