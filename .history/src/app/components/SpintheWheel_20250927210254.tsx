'use client'
import React, { useState, useRef } from 'react'
import { Play, Upload, Plus, Trash2 } from 'lucide-react'

interface WheelSection {
  text: string
  color: string
}

interface SpinWheelBuilderProps {}

const SpinWheelBuilder: React.FC<SpinWheelBuilderProps> = () => {
  const [wheelSections, setWheelSections] = useState<WheelSection[]>([
    { text: 'Option 1', color: '#FF6B6B' },
    { text: 'Option 2', color: '#4ECDC4' },
    { text: 'Option 3', color: '#45B7D1' },
    { text: 'Option 4', color: '#FFA07A' },
    { text: 'Option 5', color: '#98D8C8' },
    { text: 'Option 6', color: '#FFCE56' },
  ])

  const [wheelDescription, setWheelDescription] = useState<string>(
    'Enter your wheel description here'
  )
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const [winner, setWinner] = useState<string>('')
  const wheelRef = useRef<SVGGElement>(null)

  const colors: string[] = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#FFCE56',
    '#FF8A80',
    '#80CBC4',
    '#81C784',
    '#FFB74D',
    '#F06292',
    '#9575CD',
  ]

  const addSection = (): void => {
    const newSection: WheelSection = {
      text: `Option ${wheelSections.length + 1}`,
      color: colors[wheelSections.length % colors.length],
    }
    setWheelSections([...wheelSections, newSection])
  }

  const removeSection = (index: number): void => {
    if (wheelSections.length > 2) {
      setWheelSections(wheelSections.filter((_, i) => i !== index))
    }
  }

  const updateSection = (index: number, field: keyof WheelSection, value: string): void => {
    const updated = wheelSections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    )
    setWheelSections(updated)
  }

  const spinWheel = (): void => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner('')

    const randomSpins = Math.floor(Math.random() * 5) + 5 // 5-10 full rotations
    const randomDegree = Math.floor(Math.random() * 360)
    const totalRotation = rotation + randomSpins * 360 + randomDegree

    setRotation(totalRotation)

    // Calculate winner after animation
    setTimeout(() => {
      const normalizedDegree = (360 - (totalRotation % 360)) % 360
      const sectionAngle = 360 / wheelSections.length
      const winnerIndex = Math.floor(normalizedDegree / sectionAngle)
      setWinner(wheelSections[winnerIndex].text)
      setIsSpinning(false)
    }, 4000)
  }

  const createWheelSVG = (): JSX.Element[] => {
    const radius: number = 180
    const centerX: number = 200
    const centerY: number = 200
    const sectionAngle: number = 360 / wheelSections.length

    return wheelSections.map((section, index) => {
      const startAngle = (index * sectionAngle - 90) * (Math.PI / 180)
      const endAngle = ((index + 1) * sectionAngle - 90) * (Math.PI / 180)

      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const largeArcFlag = sectionAngle > 180 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ')

      // Text positioning
      const textAngle = startAngle + (sectionAngle * Math.PI) / 180 / 2
      const textRadius = radius * 0.7
      const textX = centerX + textRadius * Math.cos(textAngle)
      const textY = centerY + textRadius * Math.sin(textAngle)

      return (
        <g key={index}>
          <path d={pathData} fill={section.color} stroke="#fff" strokeWidth="2" />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="14"
            fontWeight="bold"
            transform={`rotate(${
              ((startAngle + (sectionAngle * Math.PI) / 180 / 2) * 180) / Math.PI
            }, ${textX}, ${textY})`}
          >
            {section.text}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 ">
      <h1 className="text-4xl font-bold text-center mb-8 ">SPIN THE WHEEL BUILDER</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Wheel */}
        <div className="flex flex-col items-center">
          {/* Logo Upload Area */}
          <div className="w-full bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-8 mb-6 text-center">
            <Upload className="mx-auto mb-2 text-gray-500" size={32} />
            <p className="text-gray-600 font-semibold">INSERT WHEEL LOGO HERE</p>
            <p className="text-sm text-gray-500 mt-2">Click to upload an image</p>
          </div>

          {/* Description */}
          <div className="w-full p-4 rounded-lg mb-6">
            <textarea
              value={wheelDescription}
              onChange={(e) => setWheelDescription(e.target.value)}
              className="w-full text-white placeholder-gray-400 resize-none border-none outline-none text-center"
              placeholder="ENTER A BRIEF DESCRIPTION OF THE WHEEL"
            />
          </div>

          {/* Wheel */}
          <div className="relative mb-6">
            <svg width="400" height="400" className="drop-shadow-lg">
              <g
                ref={wheelRef}
                style={{
                  transformOrigin: '200px 200px',
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.320, 1)' : 'none',
                }}
              >
                {createWheelSVG()}
              </g>

              {/* Center circle */}
              <circle cx="200" cy="200" r="20" fill="#333" stroke="#fff" strokeWidth="3" />

              {/* Pointer */}
              <polygon points="200,20 220,60 180,60" fill="#333" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            <Play size={20} />
            {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
          </button>

          {/* Winner Display */}
          {winner && (
            <div className="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
              <p className="text-lg font-bold text-green-800">🎉 Winner: {winner} 🎉</p>
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-2xl font-bold">
              <span className="transform rotate-12">⭐</span>
              <span>generate</span>
              <span className="transform -rotate-12">⭐</span>
            </div>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="space-y-6">
          {/* Number of Sections */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2"># of sections</h3>
            <div className="flex items-center gap-4">
              <span className="font-semibold">{wheelSections.length}</span>
              <button
                onClick={addSection}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {/* Section Inputs */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Input boxes based on # of sections</h3>
            <div className="space-y-3">
              {wheelSections.map((section, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={section.color}
                    onChange={(e) => updateSection(index, 'color', e.target.value)}
                    className="w-10 h-10 rounded border-none cursor-pointer"
                  />
                  <input
                    type="text"
                    value={section.text}
                    onChange={(e) => updateSection(index, 'text', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Section ${index + 1}`}
                  />
                  {wheelSections.length > 2 && (
                    <button
                      onClick={() => removeSection(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Controls */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Wheel Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Wheel Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter wheel title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background Style</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Classic</option>
                  <option>Modern</option>
                  <option>Neon</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpinWheelBuilder
