'use client'
import React, { useState, useEffect, FormEvent, useCallback } from 'react'
import useExplorerSearch from '../hooks/useExplorersearch'
import AdUnit from '../components/AdUnit'
import { fetchExploreWins } from '../lib/fetchWins'
import ExplorerResultCard from '../components/ExplorerComponent'
import { Search, Flame, Clock, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react'

export default function ExplorerPage(): JSX.Element {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sortMode, setSortMode] = useState<'recent' | 'hottest'>('recent')
  const [trends, setTrends] = useState<{ word: string; count: number }[]>([])

  const { search, data, loading, error } = useExplorerSearch()

  const loadFeed = useCallback(async (mode: 'recent' | 'hottest') => {
    setHistory([])
    const params = { sortBy: mode, limit: 15 }
    const results = await fetchExploreWins(params)
    const typedResults = results.map((w) => ({ ...w, type: 'win' }))
    setHistory(typedResults)
  }, [])

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/search/trends`)
        const data = await res.json()
        setTrends(data.trends || [])
      } catch (err) {
        console.error('Failed to load global trends', err)
      }
    }
    fetchTrends()
  }, [])

  useEffect(() => {
    if (!isSearching) loadFeed(sortMode)
  }, [sortMode, isSearching, loadFeed])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setIsSearching(true)
    setHistory([])
    await search(trimmed)
  }

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const unique = data.filter((item) => !history.some((h) => h.id === item.id))
      if (unique.length > 0) setHistory((prev) => [...prev, ...unique])
    }
  }, [data])

  const resetToFeed = () => {
    setQuery('')
    setIsSearching(false)
    loadFeed(sortMode)
  }

  return (
    <main className="mx-auto pb-12 px-3 md:px-4 flex flex-col min-h-screen max-w-2xl">
      {/* Search Section: Reduced padding for mobile */}
      <div className="mb-4 mt-2 w-full">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Explore Anything"
              className=" placeholder-white w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl transition-all"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white active:text-white"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* AI Trending Bar: Horizontal Scroll for Mobile */}
      <div className="mb-6 w-full">
        <div className="flex items-center gap-1.5 px-1 mb-3">
          <Sparkles size={12} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Trending
          </span>
        </div>

        {/* Horizontal scroll container */}
        <div className=" flex overflow-x-auto pb-2 gap-2 -mx-3 px-3">
          {trends.length > 0 ? (
            trends.map(({ word }) => (
              <button
                key={word}
                onClick={() => {
                  setQuery(word)
                  setIsSearching(true)
                  setHistory([])
                  search(word)
                }}
                className="bg-zinc-800  whitespace-nowrap font-black px-4 py-2 border border-white/5 text-[11px] uppercase tracking-tighter text-zinc-400 active:text-emerald-400 active:border-emerald-500/30 transition-all flex items-center gap-2 rounded-lg"
              >
                <TrendingUp size={14} color="green" />
                <p className="text-white">{word}</p>
              </button>
            ))
          ) : (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-24  animate-pulse rounded-lg" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toggle & Status Header: Adjusted for tap targets */}
      <div className="flex items-center justify-between mb-4">
        {!isSearching ? (
          <div className="xs:w-auto flex bg-zinc-900 p-1 rounded-xl border border-white/5 w-full">
            <button
              onClick={() => setSortMode('recent')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                sortMode === 'recent' ? 'bg-black text-white shadow-md' : 'text-zinc-500'
              }`}
            >
              <Clock size={16} /> Recent
            </button>
            <button
              onClick={() => setSortMode('hottest')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                sortMode === 'hottest' ? 'bg-black text-white shadow-md' : 'text-zinc-500'
              }`}
            >
              <Flame size={16} /> Hottest
            </button>
          </div>
        ) : (
          <button
            onClick={resetToFeed}
            className="text-[10px] font-black uppercase tracking-widest text-blue-500 "
          >
            <ArrowLeft size={14} color="green" />
          </button>
        )}

        <p className="xs:block hidden text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
          {isSearching ? 'Results' : sortMode}
        </p>
      </div>

      {/* Result Stream Area */}
      <div className="flex flex-col flex-grow">
        {loading && (
          <div className="flex flex-col items-center py-10">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 uppercase text-[9px] font-black tracking-widest">
              Scanning...
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex flex-col w-full">
            {history.map((item, index) => (
              <React.Fragment key={`${item.id}-${index}`}>
                <ExplorerResultCard item={item} />
                {/* The Decorative Divider */}
                {/* The Separation Line */}
                {index < history.length - 1 && (
                  <div className="px-4">
                    <hr className="border-t border-zinc-800/50 my-2" />
                  </div>
                )}
                {/* Advertisement Logic remains same */}
                {index > 0 && index % 6 === 0 && (
                  <div className="my-6 border-y border-white/[0.05] py-4">
                    <AdUnit adSlot="9056980287" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
