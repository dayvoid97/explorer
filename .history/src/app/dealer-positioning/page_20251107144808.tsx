'use client'

import { useEffect, useState } from 'react'

type NodeData = {
  strike: number
  gamma: number
  vanna: number
}

export default function DealerPositioningPage() {
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await fetch('/api/options/nvda/greeks') // your API endpoint
        const data = await res.json()
        setNodes(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [])

  if (loading) return <p className="p-8">Loading Dealer Positioning…</p>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">NVIDIA Dealer Positioning</h1>

      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 shadow bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg">Strike: ${node.strike}</p>
              <p className="text-sm text-gray-600">Gamma: {node.gamma.toFixed(6)}</p>
              <p className="text-sm text-gray-600">Vanna: {node.vanna.toFixed(6)}</p>
            </div>

            {/* Visualization Node */}
            <div
              className="h-4 rounded-full"
              style={{
                width: `${Math.abs(node.gamma) * 200}px`,
                backgroundColor: node.gamma > 0 ? '#3b82f6' : '#ef4444',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
