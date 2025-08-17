'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import WinnersNavbar from '@/app/components/WinnersNavBar'
import WinsByDateGrid from '@/app/components/WinsByDateGrid'

export default function WinnersByDatePage() {
  const { date } = useParams<{ date: string }>()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <WinnersNavbar />
      <h2 className="text-2xl font-bold text-center">
        Ws on {new Date(date).toLocaleDateString()}
      </h2>
      {date && <WinsByDateGrid date={date} />}
    </div>
  )
}
