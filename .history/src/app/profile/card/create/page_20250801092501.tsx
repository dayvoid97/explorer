import { Suspense } from 'react'
import CreateCardPage from './CreateCardPage'

export const dynamic = 'force-dynamic' // optional, prevents static export failure

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading card creator...</div>}>
      <CreateCardPage />
    </Suspense>
  )
}
