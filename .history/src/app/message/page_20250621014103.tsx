import { Suspense } from 'react'
import MessageClient from './MessageClient'

export default function MessagePage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <MessageClient />
    </Suspense>
  )
}
