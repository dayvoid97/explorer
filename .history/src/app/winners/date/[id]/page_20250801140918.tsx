'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import WinnersNavbar from '@/app/components/WinnersNavBar'
import WinsByDateGrid from '@/app/components/WinByDateGrid'

function formatDate(dateString: string | undefined): string {
  if (!dateString || typeof dateString !== 'string') return 'Invalid Date'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
}

export default function WinnersByDatePage() {
  const { date } = useParams<{ date: string }>()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <WinnersNavbar />
      <h2 className="text-2xl font-bold text-center">Only Ws on the Chat</h2>
    </div>
  )
}
