'use client'
import React, { useState, useEffect, FormEvent, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useExplorerSearch, { ExplorerItem } from '../hooks/useExplorersearch'
import CardItem from '../components/CardItem'
import WinCard from '../components/WinCard'
import AdUnit from '../components/AdUnit'

export default function ExplorerPage(): JSX.Element {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [countriesInput, setCountriesInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [history, setHistory] = useState<ExplorerItem[]>([])

  const { search, data, loading, error } = useExplorerSearch()

  // Ad slots for rotation
  const adSlots = [
    '1234567890', // Replace with your actual ad slot IDs
    '2345678901',
    '3456789012',
  ]

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

  const handleDiscoverChronologies = () => {
    router.push('/chronoW')
  }

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <div className="flex flex-col items-center mb-10 text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
          Find Anything. Learn Everything.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
          Instantly search cards, wins, market moves, macro insights, or even a username. This is
          your FG index.
        </p>
      </div>

      {/* Ambient background (optional) */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.02] bg-[url('/some-glow-graphic.svg')] bg-cover bg-center" />

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-xl mx-auto items-center"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 ENTER THE TITLE"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="🙋 @kanchan"
            className="w-full sm:w-1/2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="px-8 py-3 text-lg font-semibold bg-black text-white hover:bg-neutral-900 transition duration-200 shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-100 transform"
        >
          🚀 Search
        </button>

        {/* Trending tags / prompt */}
        <div className="text-xs mt-4  flex flex-wrap justify-center gap-3">
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Donald Trump</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">nvidia</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">winnergeez</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">"inflation"</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">rate cut</span>
        </div>
      </form>

      {/* Feedback */}
      {loading && <p className="text-center text-gray-500 mt-8 animate-pulse">🔄 Searching...</p>}
      {error && <p className="text-center text-red-500 mt-8">❌ {error}</p>}
      {!loading && history.length === 0 && (
        <p className="text-center italic text-sm text-gray-500 mt-8">
          🔍 Try "@elon" or "inflation rate" or "coca cola" — we'll find it if it exists. If it
          doesn't, drop it.
        </p>
      )}

      {!loading && history.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <React.Fragment key={item.id}>
              {adIndex === index && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
                    <AdUnit
                      adSlot={adSlots[0]} // Using first ad slot, can randomize if needed
                      className="w-full"
                      style={{
                        display: 'block',
                        width: '100%',
                        minHeight: '200px',
                        maxHeight: '300px',
                      }}
                    />
                  </div>
                </div>
              )}
              {item.type === 'card' ? <CardItem card={item} /> : <WinCard win={item} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Discover Chronologies CTA */}
      <div className="mt-5 mb-5 text-center">
        <div className="">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-4xl mb-2">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Discover CHRONODUBS
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md text-center">
              Explore curated timelines of WINNERS. Only Ws in the Chat.
            </p>
            <button
              onClick={handleDiscoverChronologies}
              className="from-black-600 px-8 py-3 bg-gradient-to-r to-red-600 font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
