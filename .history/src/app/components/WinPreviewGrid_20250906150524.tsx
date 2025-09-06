'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWins } from '../lib/fetchWins'
import WinCard from './WinCard'
import { ArrowRight } from 'lucide-react'
import AdUnit from './AdUnit'

export default function WinPreviewGrid() {
  const [wins, setWins] = useState<any[]>([])
  const router = useRouter()

  // Ad slots for rotation
  const adSlots = [
    '1234567890', // Replace with your actual ad slot IDs
    '2345678901',
    '3456789012',
  ]

  useEffect(() => {
    const getData = async () => {
      const data = await fetchWins()
      setWins(data) // ⬅️ no slicing — display all 6 wins
    }
    getData()
  }, [])

  const adIndex = useMemo(() => {
    return wins.length > 5 ? Math.floor(Math.random() * (wins.length - 2)) + 5 : null
  }, [wins])

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold dark:text-white">MOST RECENT AND POPULAR</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wins.map((win, index) => (
          <React.Fragment key={win.id}>
            {adIndex === index && (
              <div className="sm:col-span-2 md:col-span-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
                  <AdUnit
                    adSlot={adSlots[0]} // Using first ad slot, or you can randomize
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
            <WinCard win={win} />
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/winners')}
          className="inline-flex items-center gap-2 bg-black text-white text-base sm:text-lg font-semibold px-5 py-2 hover:bg-gray-900 transition"
        >
          See all wins
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
