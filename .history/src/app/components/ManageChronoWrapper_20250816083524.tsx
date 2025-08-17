'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function ManageChronologiesEntry() {
  const router = useRouter()

  return (
    <span className="text-2xl">💬</span>
    <div
      onClick={() => router.push('/chronology')}
      className="relative cursor-pointer p-4 border dark:border-gray-700 rounded-lg shadow hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Manage Chronologies</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        View, edit, and organize your chronologies.
      </p>
    </div>
  )
}
