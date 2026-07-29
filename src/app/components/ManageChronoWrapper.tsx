'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function ManageChronologiesEntry() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/chronology')}
      className="relative cursor-pointer p-4 border dark:border-gray-700 rounded-lg shadow hover:shadow-md  transition"
    >
      <h3 className="text-sm font-medium ">Manage Chronologies</h3>
      <p className="text-xs ">Create and Manage Your Chronologies</p>
    </div>
  )
}
