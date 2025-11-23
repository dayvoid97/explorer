'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

type OptionIndicator = {
  strike: number
  vanna: number
  openInterest: number
  gamma: number
  iv: number
  marketPrice: number
}

export default function DealerPositioningPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<OptionIndicator | null>(null)

  // Mock data — you’ll replace with API data later
  const data: OptionIndicator[] = [
    { strike: 450, vanna: -0.002, openInterest: 12000, gamma: 0.004, iv: 0.38, marketPrice: 12.5 },
    { strike: 460, vanna: 0.001, openInterest: 15500, gamma: 0.006, iv: 0.41, marketPrice: 11.2 },
    { strike: 470, vanna: 0.003, openInterest: 17100, gamma: 0.008, iv: 0.44, marketPrice: 10.8 },
    { strike: 480, vanna: -0.001, openInterest: 9300, gamma: 0.005, iv: 0.4, marketPrice: 9.7 },
  ]

  const handleSearch = () => {
    const match = data.find((d) => d.strike.toString() === search.trim())
    setSelected(match || null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-8 text-gray-900"
      >
        Option Indicators Dashboard
      </motion.h1>

      {/* Search Box */}
      <div className="flex items-center w-full max-w-md bg-white border border-gray-200 shadow-md rounded-2xl px-4 py-2 mb-10">
        <Search className="text-gray-500 w-5 h-5 mr-3" />
        <input
          type="text"
          placeholder="Enter Strike Price (e.g. 470)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="ml-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
        >
          Search
        </button>
      </div>

      {/* Indicator Card */}
      {selected ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { label: 'Strike Price', value: `$${selected.strike}` },
            { label: 'Market Price', value: `$${selected.marketPrice}` },
            { label: 'IV (Implied Volatility)', value: `${(selected.iv * 100).toFixed(1)}%` },
            { label: 'Gamma', value: selected.gamma.toFixed(5) },
            { label: 'Vanna', value: selected.vanna.toFixed(5) },
            { label: 'Open Interest', value: selected.openInterest.toLocaleString() },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center border border-gray-100 rounded-2xl p-4 bg-green-50 hover:bg-green-100 transition"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600 font-medium">{item.label}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-500">Search a strike price to view indicators.</p>
      )}
    </div>
  )
}
