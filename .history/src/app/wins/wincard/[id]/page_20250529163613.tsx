'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function WinDetailPage() {
  const params = useSearchParams()
  const winId = params.get('id')
  const [win, setWin] = React.useState<any>(null)

  React.useEffect(() => {
    if (!winId) return
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/${winId}`)
      .then((res) => res.json())
      .then((data) => setWin(data))
      .catch(console.error)
  }, [winId])

  if (!win) return <p>Loading…</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{win.title}</h1>
      <p className="text-sm text-gray-500">
        @{win.username} – {new Date(win.createdAt).toLocaleString()}
      </p>
      <div className="mt-4 space-y-3">
        {win.paragraphs.map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {/* TODO: render media carousel, celebrate/save buttons, related items, etc. */}
    </div>
  )
}
