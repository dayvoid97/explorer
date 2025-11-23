'use client'

import { useState } from 'react'

export default function DealerPositioningPage() {
  const [ticker, setTicker] = useState('NVDA')
  const [gamma, setGamma] = useState<number | null>(null)
  const [vanna, setVanna] = useState<number | null>(null)

  // Dummy example calculation – replace with real data
  const calculateNodes = () => {
    // these would come from an options API
    const mockGamma = Math.random() * 1000 - 500 // positive or negative
    const mockVanna = Math.random() * 1000 - 500

    setGamma(mockGamma)
    setVanna(mockVanna)
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dealer Positioning Dashboard</h1>

      <label className="block font-medium mb-2">Underlying Ticker</label>
      <input
        className="border p-3 rounded-lg w-full mb-4"
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
      />

      <button
        onClick={calculateNodes}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Load Gamma & Vanna
      </button>

      {gamma !== null && vanna !== null && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Results for {ticker}</h2>

          <p className="text-lg">
            <strong>Gamma Exposure:</strong>{' '}
            <span className={gamma > 0 ? 'text-green-600' : 'text-red-600'}>
              {gamma.toFixed(2)}
            </span>
          </p>

          <p className="text-lg">
            <strong>Vanna Exposure:</strong>{' '}
            <span className={vanna > 0 ? 'text-green-600' : 'text-red-600'}>
              {vanna.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
