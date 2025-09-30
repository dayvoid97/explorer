'use client'
import React, { useState, useRef } from 'react'
import {
  Play,
  Settings,
  Plus,
  Minus,
  RotateCcw,
  Download,
  Upload,
  Share2,
  Palette,
  Type,
  Target,
} from 'lucide-react'

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
  ])

  const [selectedWinner, setSelectedWinner] = useState<Participant | null>(null)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const [spinSpeed, setSpinSpeed] = useState<number>(4)
  const [numberOfSpins, setNumberOfSpins] = useState<number>(5)
  const [pointerPosition, setPointerPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold')
  const [textColor, setTextColor] = useState<string>('#ffffff')
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'participants' | 'design' | 'export'>('participants')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    if (participants.length <= 2) return
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBackgroundImage = () => {
    setBackgroundImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const exportAsImage = () => {
    const svg = document.querySelector('#wheel-svg') as SVGElement
    if (!svg) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 800

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#f9fafb'
      ctx.fillRect(0, 0, 800, 800)

      ctx.drawImage(img, 250, 250, 300, 300)

      ctx.fillStyle = '#374151'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Lucky Draw Wheel', 400, 80)

      if (selectedWinner) {
        ctx.fillStyle = selectedWinner.color
        ctx.font = 'bold 24px Arial'
        ctx.fillText(`🎉 Winner: ${selectedWinner.name} 🎉`, 400, 720)
      }

      const link = document.createElement('a')
      link.download = 'lucky-wheel.png'
      link.href = canvas.toDataURL()
      link.click()

      URL.revokeObjectURL(url)
    }
    img.src = url
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

      let textRotation = index * segmentAngle
      if (textRotation > 90 && textRotation < 270) {
        textRotation += 180
      }

      const getFontSize = (): number => {
        const baseSizes = { small: 10, medium: 14, large: 18 }
        const baseSize = baseSizes[fontSize]

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
    <div className="min-h-screen">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Lucky Draw Wheel</h1>
            <p className="text-lg">Create, customize, and share your spinning wheel of fortune</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            <div className="xl:col-span-2 flex flex-col items-center space-y-8 bg-black">
              <div className={`relative p-8 backdrop-blur-lg rounded-3xl shadow-2xl`}>
                <div className="relative">
                  <svg id="wheel-svg" width="300" height="300" className="drop-shadow-2xl">
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
                      <circle
                        cx="150"
                        cy="150"
                        r="20"
                        fill="#1f2937"
                        stroke="#fff"
                        strokeWidth="4"
                      />
                    </g>
                    <polygon
                      points={getPointerPoints()}
                      fill="#2f006cff"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>

              {selectedWinner && (
                <div className="text-center ">
                  <p className="text-yellow-300 text-xl mb-3">🎉 Congratulations! 🎉</p>
                  <p className="text-4xl font-bold mb-2" style={{ color: selectedWinner.color }}>
                    {selectedWinner.name}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || participants.length < 2}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  <Play size={24} />
                  {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </button>

                <button
                  onClick={resetWheel}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 border border-white/30"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>

              {participants.length < 2 && (
                <div className="text-center p-6 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl">
                  <p className="text-amber-300">⚠️ Add at least 2 participants to spin the wheel</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-red/80 backdrop-blur-lg rounded-2xl border border-white/20 p-2">
                <div className="bg-black grid grid-cols-3 ">
                  {[
                    { id: 'participants', label: 'Participants', icon: Target },
                    { id: 'design', label: 'Design', icon: Palette },
                    { id: 'export', label: 'Export', icon: Share2 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'participants' && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                      Participants ({participants.length})
                    </h2>
                    <button
                      onClick={addParticipant}
                      disabled={participants.length >= 12}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      <Plus size={12} />
                      Add Participant
                    </button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 p-2  rounded-xl border border-white/20"
                      >
                        <input
                          type="color"
                          value={participant.color}
                          onChange={(e) => updateParticipant(index, 'color', e.target.value)}
                          className=" w-10 h-10"
                        />
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                          className="flex-1 px-2 py-2 bg-white/20 backdrop-blur-sm  rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                          placeholder="Enter name"
                        />
                        <button
                          onClick={() => removeParticipant(index)}
                          disabled={participants.length <= 2}
                          className="flex items-center justify-center w-5 h-5 bg-red-500/80 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-all"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {participants.length >= 12 && (
                    <p className="text-sm text-gray-400 mt-4">Maximum 12 participants allowed</p>
                  )}
                </div>
              )}

              {activeTab === 'design' && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Type size={20} className="text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Design Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold  border-b border-white/20 pb-2">
                        Animation
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Spin Duration: {spinSpeed}s
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="0.5"
                          value={spinSpeed}
                          onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Fast</span>
                          <span>Slow</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Number of Spins: {numberOfSpins}
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          step="1"
                          value={numberOfSpins}
                          onChange={(e) => setNumberOfSpins(parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>2</span>
                          <span>10</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
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
                              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 transition-all ${
                                pointerPosition === position
                                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                  : 'border-white/30 bg-white/10 text-gray-300 hover:border-white/50'
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

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-purple-300 border-b border-white/20 pb-2">
                        Text Styling
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Font Size
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                              key={size}
                              onClick={() => setFontSize(size)}
                              className={`px-3 py-3 rounded-lg border-2 transition-all text-sm ${
                                fontSize === size
                                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                  : 'border-white/30 bg-white/10 text-gray-300 hover:border-white/50'
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
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Font Weight
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['normal', 'bold'] as const).map((weight) => (
                            <button
                              key={weight}
                              onClick={() => setFontWeight(weight)}
                              className={`px-3 py-3 rounded-lg border-2 transition-all text-sm ${
                                fontWeight === weight
                                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                  : 'border-white/30 bg-white/10 text-gray-300 hover:border-white/50'
                              }`}
                              style={{ fontWeight: weight }}
                            >
                              <span className="capitalize">{weight}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Text Color
                        </label>
                        <div className="space-y-3">
                          <div className="grid grid-cols-4 gap-2">
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
                                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                  textColor === color
                                    ? 'border-purple-400 scale-110'
                                    : 'border-white/30 hover:border-white/50'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-12 h-10 rounded border-2 border-white/30 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Share2 size={20} className="text-green-400" />
                    <h2 className="text-xl font-bold text-white">Export & Share</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-green-300 border-b border-white/20 pb-2 mb-4">
                        Background Image
                      </h3>

                      <div className="space-y-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 transition-colors text-gray-300 hover:text-white"
                        >
                          <Upload size={20} />
                          <span>Upload Background Image</span>
                        </button>

                        {backgroundImage && (
                          <div className="relative">
                            <img
                              src={backgroundImage}
                              alt="Background"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={removeBackgroundImage}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-green-300 border-b border-white/20 pb-2 mb-4">
                        Export Options
                      </h3>

                      <div className="space-y-3">
                        <button
                          onClick={exportAsImage}
                          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                        >
                          <Download size={20} />
                          <span>Download as PNG</span>
                        </button>

                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-sm text-gray-300 text-center">
                            Perfect for sharing on social media, websites, or presentations!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style jsx>{`
        input[type='range'] {
          background: transparent;
          -webkit-appearance: none;
        }
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.2s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
        }
        input[type='range']::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        input[type='range']::-webkit-slider-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        input[type='range']::-moz-range-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          border: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  )
}

export default LuckyDraw
