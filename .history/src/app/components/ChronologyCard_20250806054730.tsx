'use client'

import React from 'react'
import Link from 'next/link'

interface ChronologyCardProps {
  id: string
  name: string
  description?: string
  createdAt: number
  createdBy: string
  categories?: string[]
  collaborators?: string[]
}

const ChronologyCard: React.FC<ChronologyCardProps> = ({
  id,
  name,
  description,
  createdAt,
  createdBy,
  categories,
  collaborators = [],
}) => {
  return (
    <Link
      href={`/chronoW/${id}`}
      className="block bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 p-4 rounded-xl hover:shadow-md transition"
    >
      <h3 className="text-xl font-semibold text-white">{name}</h3>

      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {safeCategories.map((cat, i) => (
          <span
            key={i}
            className="text-xs font-medium bg-blue-800/20 text-blue-400 px-2 py-0.5 rounded-full"
          >
            #{cat}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-4 flex justify-between items-center">
        <span>👤 {createdBy}</span>
        <span>📅 {new Date(createdAt).toLocaleDateString()}</span>
      </div>

      {collaborators.length > 0 && (
        <p className="mt-2 text-xs text-gray-500 italic">
          🤝 Collaborators: {collaborators.join(', ')}
        </p>
      )}
    </Link>
  )
}

export default ChronologyCard
