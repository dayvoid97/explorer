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
  const [overlayImage, setOverlayImage] = useState<string | null>(null)
  const overlayInputRef = useRef<HTMLInputElement>(null)

  const [overlayText, setOverlayText] = useState<string>('')
  const [overlayTextSize, setOverlayTextSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [overlayTextColor, setOverlayTextColor] = useState<string>('#ffffff')

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

    const baseRotation = numberOfSpins * 200
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

  const handleOverlayImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOverlayImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeOverlayImage = () => {
    setOverlayImage(null)
    if (overlayInputRef.current) {
      overlayInputRef.current.value = ''
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

      let currentY = 20

      // Add overlay image if it exists
      if (overlayImage) {
        const overlayImg = new Image()
        overlayImg.onload = () => {
          const overlayWidth = 300
          const overlayHeight = 80
          const overlayX = (800 - overlayWidth) / 2

          ctx.drawImage(overlayImg, overlayX, currentY, overlayWidth, overlayHeight)
          currentY += overlayHeight + 20

          // Add overlay text if it exists
          if (overlayText) {
            const textSize =
              overlayTextSize === 'small' ? 24 : overlayTextSize === 'medium' ? 32 : 40
            ctx.fillStyle = overlayTextColor
            ctx.font = `bold ${textSize}px Arial`
            ctx.textAlign = 'center'
            ctx.fillText(overlayText, 400, currentY)
            currentY += textSize + 20
          }

          // Draw wheel
          ctx.drawImage(img, 250, currentY, 300, 300)

          // Add winner text at bottom
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
        overlayImg.src = overlayImage
      } else {
        // No overlay image, but check for text
        if (overlayText) {
          const textSize = overlayTextSize === 'small' ? 24 : overlayTextSize === 'medium' ? 32 : 40
          ctx.fillStyle = overlayTextColor
          ctx.font = `bold ${textSize}px Arial`
          ctx.textAlign = 'center'
          ctx.fillText(overlayText, 400, currentY + 30)
          currentY += textSize + 40
        }

        // Draw wheel
        ctx.drawImage(img, 250, currentY + 50, 300, 300)

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
        const baseSizes = { small: 10, medium: 14, large: 30 }
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
            <div className="xl:col-span-2 flex flex-col items-center  bg-black">
              {(overlayImage || overlayText) && (
                <div className="w-full max-w-md flex flex-col items-center space-y-2 mt-10">
                  {overlayImage && (
                    <img
                      src={overlayImage}
                      alt="Brand Logo"
                      className="w-full h-20 object-contain rounded-lg"
                    />
                  )}
                  {overlayText && (
                    <h2
                      className={`font-bold text-center ${
                        overlayTextSize === 'small'
                          ? 'text-lg'
                          : overlayTextSize === 'medium'
                          ? 'text-2xl'
                          : 'text-3xl'
                      }`}
                      style={{ color: overlayTextColor }}
                    >
                      {overlayText}
                    </h2>
                  )}
                </div>
              )}
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
              <div className="bg-black backdrop-blur-lg p-2">
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
                          ? 'bg-green-900 text-white shadow-lg'
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
                <div className=" rounded-xl border border-green-500/60 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Participants ({participants.length})</h2>
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
                <div className=" rounded-2xl border border-blue-500/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Type size={20} className="text-purple-400" />
                    <h2 className="text-xl font-bold ">Design Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-purple-800 border-b  pb-2">
                        Animation
                      </h3>

                      <div>
                        <label className="block text-sm font-medium  mb-3">
                          Spin Duration: {spinSpeed}s
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="0.5"
                          value={spinSpeed}
                          onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                          className="slider w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                              ((spinSpeed - 1) / (8 - 1)) * 100
                            }%, #4b5563 ${((spinSpeed - 1) / (8 - 1)) * 100}%, #4b5563 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-xs  mt-1">
                          <span>Fast</span>
                          <span>Slow</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium  mb-3">
                          Number of Spins: {numberOfSpins}
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          step="1"
                          value={numberOfSpins}
                          onChange={(e) => setNumberOfSpins(parseInt(e.target.value))}
                          className="slider w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                              ((numberOfSpins - 2) / (10 - 2)) * 100
                            }%, #4b5563 ${((numberOfSpins - 2) / (10 - 2)) * 100}%, #4b5563 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-xs  mt-1">
                          <span>2</span>
                          <span>10</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium  mb-3">Pointer Position</label>
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
                                  ? 'border-purple-500 bg-purple-500/20 '
                                  : ' bg-white/10  hover:border-white/50'
                              }`}
                            >
                              {position === 'top' && '🔻'}
                              {position === 'right' && '◀️'}
                              {position === 'bottom' && '🔺'}
                              {position === 'left' && '▶️'}
                              <span className="text-sm capitalize">{position}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-purple-800 border-b  pb-2">
                        Text Styling
                      </h3>

                      <div>
                        <label className="font-bold block text-sm mb-3">Font Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                              key={size}
                              onClick={() => setFontSize(size)}
                              className={`px-3 py-3 rounded-lg border-2 transition-all text-sm ${
                                fontSize === size
                                  ? 'border-purple-500 bg-purple-500/20 text-green-800 font-bold'
                                  : 'border-white/30 bg-white/10  hover:border-white/50'
                              }`}
                            >
                              <span className="capitalize">{size}</span>
                              <br />
                              <span className="text-xs opacity-60">
                                {size === 'small' && '10px'}
                                {size === 'medium' && '20px'}
                                {size === 'large' && '40px'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-3">Font Weight</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['normal', 'bold'] as const).map((weight) => (
                            <button
                              key={weight}
                              onClick={() => setFontWeight(weight)}
                              className={`px-3 py-3 rounded-lg border-2 transition-all text-sm ${
                                fontWeight === weight
                                  ? 'border-purple-500 bg-purple-500/20 text-green-800 '
                                  : 'border-white/30 bg-white/10  hover:border-white/50'
                              }`}
                              style={{ fontWeight: weight }}
                            >
                              <span className="capitalize">{weight}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-3">Text Color</label>
                        <div className="flex flex-col gap-3">
                          {/* 8 Essential Colors */}
                          <div className="flex gap-2">
                            {[
                              '#000000', // Black
                              '#ef4444', // Red
                              '#f59e0b', // Orange
                              '#eab308', // Yellow
                              '#22c55e', // Green
                              '#3b82f6', // Blue
                              '#8b5cf6', // Purple
                            ].map((color) => (
                              <button
                                key={color}
                                onClick={() => setTextColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 ${
                                  textColor === color
                                    ? 'border-white scale-110 shadow-lg ring-2 ring-purple-400'
                                    : 'border-white/30 hover:border-white/50'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>

                          {/* Custom Color Picker */}
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-10 h-10 rounded-full "
                            />
                            <span className="text-m font-bold text-black"> {`<-- Pick Color`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="border-red-800/50 backdrop-blur-lg rounded-2xl border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Share2 size={20} className="text-green-400" />
                    <h2 className="text-xl font-bold ">Export & Share</h2>
                  </div>

                  <p className="text-sm font-bold text-center">
                    Perfect for sharing on social media, websites, or presentations!
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-green-800 border-b pb-2 mb-4">
                        Brand Logo
                      </h3>

                      <div className="space-y-3">
                        <input
                          ref={overlayInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleOverlayImageUpload}
                          className="hidden"
                        />

                        <button
                          onClick={() => overlayInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 transition-colors hover:text-white"
                        >
                          <Upload size={20} />
                          <span>Upload Brand Logo</span>
                        </button>

                        {overlayImage && (
                          <div className="relative ">
                            <img
                              src={overlayImage}
                              alt="Brand Logo"
                              className="w-full h-24 object-cover "
                            />
                            <button
                              onClick={removeOverlayImage}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-green-800 border-b pb-2 mb-4">
                        Custom Text
                      </h3>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={overlayText}
                          onChange={(e) => setOverlayText(e.target.value)}
                          placeholder="Enter custom text (optional)"
                          className="w-full px-3 py-2  backdrop-blur-sm border border-white/30 rounded-lg  focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        {overlayText && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Text Size
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {(['small', 'medium', 'large'] as const).map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setOverlayTextSize(size)}
                                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                                      overlayTextSize === size
                                        ? 'border-green-500 bg-green-500/20 text-green-300'
                                        : 'border-white/30 bg-white/10 text-white hover:border-white/50'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Text Color
                              </label>
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  {[
                                    '#ffffff',
                                    '#000000',
                                    '#ef4444',
                                    '#f59e0b',
                                    '#eab308',
                                    '#22c55e',
                                    '#3b82f6',
                                    '#8b5cf6',
                                  ].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => setOverlayTextColor(color)}
                                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                                        overlayTextColor === color
                                          ? 'border-white scale-110 ring-2 ring-green-400'
                                          : 'border-white/30 hover:border-white/50'
                                      }`}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={overlayTextColor}
                                    onChange={(e) => setOverlayTextColor(e.target.value)}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <span className="text-sm text-white">Custom</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold border-b border-white/20 pb-2 mb-4">
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
    </div>
  )
}

export default LuckyDraw
