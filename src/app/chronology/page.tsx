'use client'

import MyChronologies from '../components/ChronoSettings'

export default function InboxPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Your Chronologies</h1>
      <MyChronologies />
    </main>
  )
}
