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
      <h3 className="">Manage Chronologies</h3>
      <p className="text-sm text-gray-600 mt-1">View, edit, and organize your chronologies.</p>
    </div>
  )
}
