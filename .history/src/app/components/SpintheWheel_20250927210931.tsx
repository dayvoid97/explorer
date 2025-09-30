'use client'
import React, { useState, useRef } from 'react'
import { Play, Upload } from 'lucide-react'

interface WheelSection {
  text: string
}

const SpinWheelBuilder: React.FC = () => {
  const [numberOfOptions, setNumberOfOptions] = useState<number>(6)
  const [wheelSections, setWheelSections] = useState<WheelSection[]>(
    Array.from({ length: 6 }, (_, i) => ({ text: `Option ${i + 1}` }))
  )
  const [wheelDescription, setWheelDescription] = useState<string>(
    'Enter your wheel description here'
  )
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const [winner, setWinner] = useState<string>('')
  const [logoImage, setLogoImage] = useState<string>('')
  const wheelRef = useRef<SVGGElement>(null)

  const handleNumberOfOptionsChange = (newNumber: number): void => {
    setNumberOfOptions(newNumber)
    const newSections = Array.from({ length: newNumber }, (_, i) => ({
      text: wheelSections[i]?.text || `Option ${i + 1}`,
    }))
    setWheelSections(newSections)
  }

  const updateSection = (index: number, value: string): void => {
    const updated = wheelSections.map((section, i) =>
      i === index ? { ...section, text: value } : section
    )
    setWheelSections(updated)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const spinWheel = (): void => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner('')

    const randomSpins = Math.floor(Math.random() * 5) + 5
    const randomDegree = Math.floor(Math.random() * 360)
    const totalRotation = rotation + randomSpins * 360 + randomDegree

    setRotation(totalRotation)

    setTimeout(() => {
      const normalizedDegree = (360 - (totalRotation % 360)) % 360
      const sectionAngle = 360 / wheelSections.length
      const winnerIndex = Math.floor(normalizedDegree / sectionAngle)
      setWinner(wheelSections[winnerIndex].text)
      setIsSpinning(false)
    }, 4000)
  }

  const createWheelSVG = (): JSX.Element[] => {
    const radius: number = 150
    const centerX: number = 200
    const centerY: number = 200
    const sectionAngle: number = 360 / wheelSections.length

    return wheelSections.map((section: WheelSection, index: number) => {
      const startAngle: number = (index * sectionAngle - 90) * (Math.PI / 180)
      const endAngle: number = ((index + 1) * sectionAngle - 90) * (Math.PI / 180)

      const x1: number = centerX + radius * Math.cos(startAngle)
      const y1: number = centerY + radius * Math.sin(startAngle)
      const x2: number = centerX + radius * Math.cos(endAngle)
      const y2: number = centerY + radius * Math.sin(endAngle)

      const largeArcFlag: number = sectionAngle > 180 ? 1 : 0

      const pathData: string = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ')

      const textAngle: number = startAngle + (sectionAngle * Math.PI) / 180 / 2
      const textRadius: number = radius * 0.7
      const textX: number = centerX + textRadius * Math.cos(textAngle)
      const textY: number = centerY + textRadius * Math.sin(textAngle)

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={index % 2 === 0 ? '#e5e5e5' : '#d1d5db'}
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#374151"
            fontSize="12"
            fontWeight="600"
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
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 ">SPIN THE WHEEL BUILDER</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Wheel */}
        <div className="flex flex-col items-center space-y-6">
          {/* Logo Upload Area */}
          <div className="w-full max-w-sm">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className=" border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer"
            >
              {logoImage ? (
                <img
                  src={logoImage}
                  alt="Wheel Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="mb-2" size={24} />
                  <p className=" text-sm font-medium">INSERT WHEEL LOGO HERE</p>
                </>
              )}
            </label>
          </div>

          {/* Description */}
          <div className="w-full max-w-sm">
            <textarea
              value={wheelDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setWheelDescription(e.target.value)
              }
              className="  p-3 rounded-lg resize-none border-none outline-none text-center"
              placeholder="ENTER A BRIEF DESCRIPTION OF THE WHEEL"
              rows={2}
            />
          </div>

          {/* Wheel */}
          <div className="relative">
            <svg width="400" height="400" className="drop-shadow-md">
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
              <circle cx="200" cy="200" r="200" fill="#16004cff" stroke="#fff" strokeWidth="2" />

              {/* Pointer */}
              <polygon points="200,30 210,50 190,50" fill="#374151" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            <Play size={20} />
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </button>

          {/* Winner Display */}
          {winner && (
            <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
              <p className="text-lg font-bold text-gray-800">🎉 Winner: {winner} 🎉</p>
            </div>
          )}
        </div>

        {/* Right Side - Controls */}
        <div className="space-y-6">
          {/* Number of Options */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-3 text-gray-800"># of Options</h3>
            <select
              value={numberOfOptions}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNumberOfOptionsChange(parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Option Inputs */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Options</h3>
            <div className="space-y-3">
              {wheelSections.map((section, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={section.text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSection(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpinWheelBuilder
