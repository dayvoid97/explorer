'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

type NodeData = {
  strike: number
  gamma: number
  vanna: number
}

export default function DealerPositioningPage() {
  const [nodes, setNodes] = useState<NodeData[]>([])

  // For now, mock NVIDIA option data
  useEffect(() => {
    const mockData: NodeData[] = [
      { strike: 450, gamma: 0.0031, vanna: -0.0012 },
      { strike: 460, gamma: 0.0046, vanna: -0.0025 },
      { strike: 470, gamma: 0.0063, vanna: -0.0031 },
      { strike: 480, gamma: 0.0041, vanna: 0.0009 },
      { strike: 490, gamma: 0.0022, vanna: 0.0018 },
      { strike: 500, gamma: -0.0012, vanna: 0.0024 },
    ]
    setNodes(mockData)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 space-y-10">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold text-gray-900"
      >
        NVIDIA Dealer Positioning
      </motion.h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Gamma Chart */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Gamma Exposure</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nodes}>
              <XAxis dataKey="strike" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="gamma" fill="#3b82f6" name="Gamma" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vanna Chart */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Vanna Exposure</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nodes}>
              <XAxis dataKey="strike" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vanna" fill="#10b981" name="Vanna" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Node Summary Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col"
          >
            <span className="font-semibold text-lg text-gray-900 mb-2">Strike: ${node.strike}</span>
            <div className="text-gray-600 space-y-1">
              <p>Gamma: {node.gamma.toFixed(5)}</p>
              <p>Vanna: {node.vanna.toFixed(5)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
