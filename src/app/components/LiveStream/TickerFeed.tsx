'use client'

import React, { useState, useEffect } from 'react'

interface TickerData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

interface TickerFeedProps {
  streamId: string
}

export default function TickerFeed({ streamId }: TickerFeedProps) {
  const [tickers, setTickers] = useState<TickerData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Mock ticker data - replace with real WebSocket feed
  const mockTickers: TickerData[] = [
    { symbol: 'AAPL', price: 175.43, change: 2.15, changePercent: 1.24, volume: 45678900, marketCap: 2750000000000 },
    { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, volume: 23456700, marketCap: 1780000000000 },
    { symbol: 'MSFT', price: 378.85, change: 5.67, changePercent: 1.52, volume: 34567800, marketCap: 2810000000000 },
    { symbol: 'TSLA', price: 248.42, change: -3.21, changePercent: -1.28, volume: 56789000, marketCap: 789000000000 },
    { symbol: 'NVDA', price: 485.09, change: 12.34, changePercent: 2.61, volume: 67890100, marketCap: 1190000000000 },
    { symbol: 'AMZN', price: 155.72, change: 1.89, changePercent: 1.23, volume: 45678900, marketCap: 1610000000000 },
    { symbol: 'META', price: 334.69, change: -2.45, changePercent: -0.73, volume: 23456700, marketCap: 847000000000 },
    { symbol: 'NFLX', price: 485.09, change: 8.76, changePercent: 1.84, volume: 34567800, marketCap: 214000000000 }
  ]

  useEffect(() => {
    // Simulate real-time ticker updates
    const updateTickers = () => {
      setTickers(prevTickers => 
        prevTickers.map(ticker => ({
          ...ticker,
          price: ticker.price + (Math.random() - 0.5) * 2,
          change: ticker.change + (Math.random() - 0.5) * 0.5,
          changePercent: ((ticker.price + (Math.random() - 0.5) * 2) - (ticker.price - ticker.change)) / (ticker.price - ticker.change) * 100,
          volume: ticker.volume + Math.floor(Math.random() * 1000000)
        }))
      )
      setLastUpdate(new Date())
    }

    // Initial load
    setTickers(mockTickers)
    setIsConnected(true)
    setLastUpdate(new Date())

    // Update every 2 seconds
    const interval = setInterval(updateTickers, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2)
  }

  const formatChangePercent = (changePercent: number) => {
    return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  return (
    <div className="h-full bg-gray-800 border-t border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-semibold text-sm">Live Ticker Feed</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        {lastUpdate && (
          <span className="text-gray-400 text-xs">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Ticker Grid */}
      <div className="h-full overflow-hidden">
        <div className="grid grid-cols-4 gap-1 p-2 h-full">
          {tickers.map((ticker) => (
            <div
              key={ticker.symbol}
              className="bg-gray-900 rounded p-2 flex flex-col justify-between"
            >
              {/* Symbol and Price */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold text-sm">{ticker.symbol}</span>
                <span className="text-white text-sm font-mono">
                  ${formatPrice(ticker.price)}
                </span>
              </div>

              {/* Change and Volume */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className={`text-xs font-mono ${
                    ticker.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatChange(ticker.change)}
                  </span>
                  <span className={`text-xs ${
                    ticker.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatChangePercent(ticker.changePercent)}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  Vol: {formatVolume(ticker.volume)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
          Connecting to ticker feed...
        </div>
      )}
    </div>
  )
} 