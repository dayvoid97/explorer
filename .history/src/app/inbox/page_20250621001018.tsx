'use client'

import InboxPreview from '../components/InboxPreview'

export default function InboxPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Conversations</h1>
      <InboxPreview />
    </main>
  )
}
