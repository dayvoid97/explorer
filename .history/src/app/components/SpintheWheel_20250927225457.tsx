'use client'
import React, { useState } from 'react'
import { Play, Settings } from 'lucide-react'

interface Winner {
  name: string
  color: string
}

const winners: Winner[] = [
  { name: 'Alice', color: '#FF6B6B' },
  { name: 'Bob', color: '#4ECDC4' },
  { name: 'Charlie', color: '#45B7D1' },
  { name: 'Diana', color: '#FFA07A' },
  { name: 'Ethan', color: '#98D8C8' },
  { name: 'Fiona', color: '#FFCE56' },
]

const LuckyDraw: React.FC = () => {
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const [spinSpeed, setSpinSpeed] = useState<number>(4) // seconds
  const [numberOfSpins, setNumberOfSpins] = useState<number>(5)
  const [pointerPosition, setPointerPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const [pointerColor, setPointerColor] = useState<'red' | 'blue' | 'green'>('red')

  const getPointerPoints = (): string => {
    switch (pointerPosition) {
      case 'top':
        return '100,80 120,40 80,40'

      case 'bottom':
        return '150,250 170,290 130,290'
      case 'left':
        return '50,150 10,130 10,170'
      case 'right':
        return '250,150 290,130 290,170'
      default:
        return '150,50 170,10 130,10'
    }
  }

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedWinner(null)

    const randomIndex = Math.floor(Math.random() * winners.length)
    const segmentAngle = 360 / winners.length
    const finalAngle = numberOfSpins * 360 + randomIndex * segmentAngle

    setRotation((prev) => prev + finalAngle)

    setTimeout(() => {
      setIsSpinning(false)
      setSelectedWinner(winners[randomIndex])
    }, spinSpeed * 1000)
  }

  const createWheelSegments = (): JSX.Element[] => {
    const segmentAngle = 360 / winners.length

    return winners.map((winner, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)

      const radius = 150
      const centerX = 150
      const centerY = 150

      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const largeArcFlag = segmentAngle > 180 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ')

      const textAngle = startAngle + (segmentAngle * Math.PI) / 180 / 2
      const textRadius = radius * 0.7
      const textX = centerX + textRadius * Math.cos(textAngle)
      const textY = centerY + textRadius * Math.sin(textAngle)

      return (
        <g key={index}>
          <path d={pathData} fill={winner.color} stroke="#fff" strokeWidth="3" />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="14"
            fontWeight="bold"
            transform={`rotate(${(textAngle * 180) / Math.PI}, ${textX}, ${textY})`}
          >
            {winner.name}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">🎯 Lucky Draw Wheel</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Wheel Section */}
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <svg width="300" height="300" className="drop-shadow-lg">
                <g
                  style={{
                    transformOrigin: '100px 150px',
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? `transform ${spinSpeed}s cubic-bezier(0.23, 1, 0.32, 1)`
                      : 'none',
                  }}
                >
                  {createWheelSegments()}
                  <circle cx="150" cy="150" r="20" fill="#374151" stroke="#fff" strokeWidth="3" />
                </g>
                <polygon
                  points={getPointerPoints()}
                  fill="#030202ff"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <Play size={24} />
              {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
            </button>

            {selectedWinner && (
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200">
                <p className="text-gray-600 text-lg mb-2">🎉 Winner 🎉</p>
                <p className="text-3xl font-bold" style={{ color: selectedWinner.color }}>
                  {selectedWinner.name}
                </p>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border ">
            <div className="flex items-center gap-3 mb-6">
              <Settings size={24} className="text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Spin Duration: {spinSpeed}s
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={spinSpeed}
                  onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                  className="slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Fast (1s)</span>
                  <span>Slow (8s)</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Number of Spins: {numberOfSpins}
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={numberOfSpins}
                  onChange={(e) => setNumberOfSpins(parseInt(e.target.value))}
                  className="slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>2 spins</span>
                  <span>10 spins</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Pointer Position
                </label>
                <select
                  value={pointerPosition}
                  onChange={(e) =>
                    setPointerPosition(e.target.value as 'top' | 'bottom' | 'left' | 'right')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="top">🔺 Top</option>
                  <option value="bottom">🔻 Bottom</option>
                  <option value="left">◀️ Left</option>
                  <option value="right">▶️ Right</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Participants</h3>
                <div className="grid grid-cols-2 gap-2">
                  {winners.map((winner, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: winner.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{winner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
          transition: background 0.15s ease-in-out;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default LuckyDraw
