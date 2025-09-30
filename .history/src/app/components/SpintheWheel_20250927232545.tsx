'use client'
import React, { useState, useEffect } from 'react'
import { Play, Settings, Plus, Minus, RotateCcw } from 'lucide-react'

interface Participant {
  name: string
  color: string
}

const defaultColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#FFCE56',
  '#FF8A80',
  '#B39DDB',
  '#81C784',
  '#FFB74D',
  '#F06292',
  '#64B5F6',
]

const LuckyDraw: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([
    { name: 'Alice', color: '#FF6B6B' },
    { name: 'Bob', color: '#4ECDC4' },
    { name: 'Charlie', color: '#45B7D1' },
    { name: 'Diana', color: '#FFA07A' },
    { name: 'Ethan', color: '#98D8C8' },
    { name: 'Fiona', color: '#FFCE56' },
  ])

  const [selectedWinner, setSelectedWinner] = useState<Participant | null>(null)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const [spinSpeed, setSpinSpeed] = useState<number>(4)
  const [numberOfSpins, setNumberOfSpins] = useState<number>(5)
  const [pointerPosition, setPointerPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold')
  const [textColor, setTextColor] = useState<string>('#ffffff')

  const getPointerPoints = (): string => {
    switch (pointerPosition) {
      case 'top':
        return '150,30 170,10 130,10'
      case 'bottom':
        return '150,270 170,290 130,290'
      case 'left':
        return '30,150 10,130 10,170'
      case 'right':
        return '270,150 290,130 290,170'
      default:
        return '150,30 170,10 130,10'
    }
  }

  const getPointerAngle = (): number => {
    const pointerAngles = {
      top: 0,
      right: 90,
      bottom: 180,
      left: 270,
    }
    return pointerAngles[pointerPosition]
  }

  const getWinnerFromRotation = (finalRotation: number): number => {
    if (participants.length === 0) return 0

    const segmentAngle = 360 / participants.length
    const pointerAngle = getPointerAngle()

    const effectiveAngle = (pointerAngle - (finalRotation % 360) + 360) % 360
    const segmentIndex =
      Math.floor((effectiveAngle + segmentAngle / 2) / segmentAngle) % participants.length

    return segmentIndex
  }

  const clearAllStates = () => {
    setSelectedWinner(null)
    setRotation(0)
    setIsSpinning(false)
  }

  const spinWheel = () => {
    if (isSpinning || participants.length < 2) return

    setIsSpinning(true)
    setSelectedWinner(null)

    const baseRotation = numberOfSpins * 360
    const randomRotation = Math.random() * 360
    const finalRotation = baseRotation + randomRotation

    setRotation((prev) => prev + finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      const winnerIndex = getWinnerFromRotation(rotation + finalRotation)
      setSelectedWinner(participants[winnerIndex])
    }, spinSpeed * 1000)
  }

  const addParticipant = () => {
    const newIndex = participants.length
    const newParticipant: Participant = {
      name: `Person ${newIndex + 1}`,
      color: defaultColors[newIndex % defaultColors.length],
    }
    setParticipants([...participants, newParticipant])
    clearAllStates()
  }

  const removeParticipant = (index: number) => {
    if (participants.length <= 2) return // Minimum 2 participants
    const newParticipants = participants.filter((_, i) => i !== index)
    setParticipants(newParticipants)
    clearAllStates()
  }

  const updateParticipant = (index: number, field: 'name' | 'color', value: string) => {
    const newParticipants = [...participants]
    newParticipants[index] = { ...newParticipants[index], [field]: value }
    setParticipants(newParticipants)
    clearAllStates()
  }

  const resetWheel = () => {
    clearAllStates()
  }

  const createWheelSegments = (): JSX.Element[] => {
    if (participants.length === 0) return []

    const segmentAngle = 360 / participants.length

    return participants.map((participant, index) => {
      const startAngle = (index * segmentAngle - segmentAngle / 2) * (Math.PI / 180)
      const endAngle = ((index + 1) * segmentAngle - segmentAngle / 2) * (Math.PI / 180)

      const radius = 140
      const centerX = 150
      const centerY = 150

      const x1 = centerX + radius * Math.sin(startAngle)
      const y1 = centerY - radius * Math.cos(startAngle)
      const x2 = centerX + radius * Math.sin(endAngle)
      const y2 = centerY - radius * Math.cos(endAngle)

      const largeArcFlag = segmentAngle > 180 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ')

      const textAngle = index * segmentAngle * (Math.PI / 180)
      const textRadius = radius * 0.7
      const textX = centerX + textRadius * Math.sin(textAngle)
      const textY = centerY - textRadius * Math.cos(textAngle)

      // Calculate text rotation to keep it readable
      let textRotation = index * segmentAngle

      // If text would be upside down (between 90° and 270°), flip it
      if (textRotation > 90 && textRotation < 270) {
        textRotation += 180
      }

      // Calculate font size based on user setting and participant count
      const getFontSize = (): number => {
        const baseSizes = { small: 10, medium: 14, large: 18 }
        const baseSize = baseSizes[fontSize]

        // Scale down for crowded wheels
        if (participants.length > 10) return Math.max(baseSize - 6, 8)
        if (participants.length > 8) return Math.max(baseSize - 4, 9)
        if (participants.length > 6) return Math.max(baseSize - 2, 10)
        return baseSize
      }

      const adjustedFontSize = getFontSize()

      return (
        <g key={index}>
          <path d={pathData} fill={participant.color} stroke="#fff" strokeWidth="3" />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={textColor}
            fontSize={adjustedFontSize}
            fontWeight={fontWeight}
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
          >
            {participant.name}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">SPIN THE WHEEL</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Wheel Section */}
          <div className="xl:col-span-2 flex flex-col items-center space-y-8">
            <div className="relative">
              <svg width="300" height="300" className="drop-shadow-lg">
                <g
                  style={{
                    transformOrigin: '150px 150px',
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? `transform ${spinSpeed}s cubic-bezier(0.23, 1, 0.32, 1)`
                      : 'none',
                  }}
                >
                  {createWheelSegments()}
                  <circle cx="150" cy="150" r="20" fill="#374151" stroke="#fff" strokeWidth="3" />
                </g>
                <polygon points={getPointerPoints()} fill="#dc2626" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex gap-4">
              <button
                onClick={spinWheel}
                disabled={isSpinning || participants.length < 2}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                <Play size={24} />
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>

              <button
                onClick={resetWheel}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all transform hover:scale-105"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            {participants.length < 2 && (
              <div className="text-center p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800">⚠️ Add at least 2 participants to spin the wheel</p>
              </div>
            )}

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
          <div className="space-y-6">
            {/* Participants Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Participants ({participants.length})
                </h2>
                <button
                  onClick={addParticipant}
                  disabled={participants.length >= 12}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="color"
                      value={participant.color}
                      onChange={(e) => updateParticipant(index, 'color', e.target.value)}
                      className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />
                    <button
                      onClick={() => removeParticipant(index)}
                      disabled={participants.length <= 2}
                      className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {participants.length >= 12 && (
                <p className="text-sm text-gray-500 mt-2">Maximum 12 participants allowed</p>
              )}
            </div>

            {/* Settings Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center gap-3 mb-6">
                <Settings size={20} className="text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Wheel Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Spin Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Animation</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Spin Duration: {spinSpeed}s
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={spinSpeed}
                      onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                      className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Number of Spins: {numberOfSpins}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="1"
                      value={numberOfSpins}
                      onChange={(e) => setNumberOfSpins(parseInt(e.target.value))}
                      className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>2</span>
                      <span>10</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Pointer Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['top', 'right', 'bottom', 'left'] as const).map((position) => (
                        <button
                          key={position}
                          onClick={() => {
                            setPointerPosition(position)
                            clearAllStates()
                          }}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                            pointerPosition === position
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {position === 'top' && '🔺'}
                          {position === 'right' && '▶️'}
                          {position === 'bottom' && '🔻'}
                          {position === 'left' && '◀️'}
                          <span className="text-sm capitalize">{position}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Styling */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                    Text Styling
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                            fontSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <span className="capitalize">{size}</span>
                          <br />
                          <span className="text-xs opacity-60">
                            {size === 'small' && '10px'}
                            {size === 'medium' && '14px'}
                            {size === 'large' && '18px'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Font Weight
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['normal', 'bold'] as const).map((weight) => (
                        <button
                          key={weight}
                          onClick={() => setFontWeight(weight)}
                          className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                            fontWeight === weight
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                          style={{ fontWeight: weight }}
                        >
                          <span className="capitalize">{weight}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Text Color
                    </label>
                    <div className="space-y-3">
                      {/* Preset Colors */}
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          '#ffffff',
                          '#000000',
                          '#374151',
                          '#ef4444',
                          '#f59e0b',
                          '#10b981',
                          '#3b82f6',
                          '#8b5cf6',
                        ].map((color) => (
                          <button
                            key={color}
                            onClick={() => setTextColor(color)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              textColor === color
                                ? 'border-gray-600 scale-110'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>

                      {/* Custom Color */}
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-10 h-8 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
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
          height: 16px;
          width: 16px;
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
