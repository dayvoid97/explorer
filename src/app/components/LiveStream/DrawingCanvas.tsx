'use client'

import React, { useRef, useEffect, useState } from 'react'

interface DrawingCanvasProps {
  onClose: () => void
  onUpdate: (drawingData: any) => void
}

interface DrawingPoint {
  x: number
  y: number
  pressure?: number
}

interface DrawingStroke {
  id: string
  points: DrawingPoint[]
  color: string
  width: number
  tool: 'pen' | 'highlighter' | 'eraser'
}

export default function DrawingCanvas({ onClose, onUpdate }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null)
  const [strokes, setStrokes] = useState<DrawingStroke[]>([])
  const [selectedTool, setSelectedTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [selectedWidth, setSelectedWidth] = useState(2)
  const [isHost, setIsHost] = useState(false)

  const colors = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000'
  ]

  const tools = [
    { id: 'pen', icon: '✏️', label: 'Pen' },
    { id: 'highlighter', icon: '🖍️', label: 'Highlighter' },
    { id: 'eraser', icon: '🧽', label: 'Eraser' }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Set initial background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Redraw all strokes
    redrawCanvas()
  }, [strokes])

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw all strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
      } else {
        ctx.globalCompositeOperation = 'source-over'
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }

      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
    })
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): DrawingPoint => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const point = getMousePos(e)
    
    const newStroke: DrawingStroke = {
      id: Date.now().toString(),
      points: [point],
      color: selectedTool === 'eraser' ? '#000000' : selectedColor,
      width: selectedWidth,
      tool: selectedTool
    }
    
    setCurrentStroke(newStroke)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return

    const point = getMousePos(e)
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    }
    
    setCurrentStroke(updatedStroke)
    
    // Draw the line segment
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prevPoint = currentStroke.points[currentStroke.points.length - 1]
    
    ctx.beginPath()
    ctx.strokeStyle = updatedStroke.color
    ctx.lineWidth = updatedStroke.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (updatedStroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    ctx.moveTo(prevPoint.x, prevPoint.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
  }

  const handleMouseUp = () => {
    if (isDrawing && currentStroke) {
      setStrokes(prev => [...prev, currentStroke])
      setCurrentStroke(null)
      
      // Send drawing update to other participants
      onUpdate({
        type: 'new_stroke',
        stroke: currentStroke
      })
    }
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    setStrokes([])
    onUpdate({
      type: 'clear_canvas'
    })
  }

  const undoLastStroke = () => {
    setStrokes(prev => {
      const newStrokes = prev.slice(0, -1)
      onUpdate({
        type: 'undo_stroke',
        strokeCount: newStrokes.length
      })
      return newStrokes
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 bg-gray-800 rounded-lg p-4 space-y-4">
        {/* Tools */}
        <div className="space-y-2">
          <h3 className="text-white text-sm font-semibold">Tools</h3>
          <div className="flex flex-col space-y-1">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id as any)}
                className={`p-2 rounded ${
                  selectedTool === tool.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={tool.label}
              >
                <span className="text-lg">{tool.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <h3 className="text-white text-sm font-semibold">Colors</h3>
          <div className="grid grid-cols-5 gap-1">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded border-2 ${
                  selectedColor === color ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Width */}
        <div className="space-y-2">
          <h3 className="text-white text-sm font-semibold">Width</h3>
          <input
            type="range"
            min="1"
            max="20"
            value={selectedWidth}
            onChange={(e) => setSelectedWidth(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-white text-xs text-center">{selectedWidth}px</div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={undoLastStroke}
            disabled={strokes.length === 0}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={clearCanvas}
            className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"
      >
        ✕
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-crosshair"
      />

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
        <p>Draw on the screen to annotate charts and analysis</p>
        <p className="text-gray-400 text-xs">All participants can see your drawings in real-time</p>
      </div>
    </div>
  )
} 