'use client'
import React, { useState, useEffect } from 'react'

interface Winner {
  name: string
  color: string
}

const winners: Winner[] = [
  { name: 'Alice', color: '#F87171' },
  { name: 'Bob', color: '#60A5FA' },
  { name: 'Charlie', color: '#34D399' },
  { name: 'Diana', color: '#FBBF24' },
  { name: 'Ethan', color: '#A78BFA' },
  { name: 'Fiona', color: '#F472B6' },
]

const LuckyDraw = () => {
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [spinDuration, setSpinDuration] = useState<number>(4) // duration in seconds

  const segmentAngle = 360 / winners.length

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedWinner(null)

    // Random spin amount and winner selection
    const randomSpins = Math.floor(Math.random() * 5) + 5 // 5–10 full rotations
    const randomIndex = Math.floor(Math.random() * winners.length)
    const finalRotation = randomSpins * 360 + randomIndex * segmentAngle + segmentAngle / 2

    setRotation((prev) => prev + finalRotation)

    // Wait for spin to finish
    setTimeout(() => {
      setIsSpinning(false)
      setSelectedWinner(winners[randomIndex])
    }, spinDuration * 1000) // based on selected speed
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🎯 Lucky Draw Wheel</h1>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Wheel */}
        <div className="relative w-64 h-64">
          <div
            className="absolute w-full h-full rounded-full border-4 border-gray-800"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? `transform ${spinDuration}s cubic-bezier(0.23, 1, 0.32, 1)`
                : 'none',
            }}
          >
            {winners.map((winner, index) => (
              <div
                key={index}
                className="absolute w-1/2 h-1/2 origin-bottom-left"
                style={{
                  backgroundColor: winner.color,
                  transform: `rotate(${index * segmentAngle}deg) skewY(-${90 - segmentAngle}deg)`,
                }}
              />
            ))}
          </div>
          {/* Pointer */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600" />
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-md w-72 border border-gray-200">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">Settings</h2>

          {/* Spin Speed Control */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">Spin Duration</label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={spinDuration}
              onChange={(e) => setSpinDuration(parseFloat(e.target.value))}
              className="w-full accent-gray-700"
            />
            <p className="text-sm text-gray-500 mt-1">{spinDuration}s</p>
          </div>

          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isSpinning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel 🎡'}
          </button>

          {selectedWinner && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">Winner:</p>
              <p className="text-2xl font-bold mt-1" style={{ color: selectedWinner.color }}>
                {selectedWinner.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LuckyDraw
