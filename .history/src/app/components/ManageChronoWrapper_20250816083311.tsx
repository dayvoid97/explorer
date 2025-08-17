'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function ManageChronologiesEntry() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/chronology')}
      className="cursor-pointer border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
    >
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Manage Chronologies</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        View, edit, and organize your chronologies.
      </p>
    </div>
  )
}
