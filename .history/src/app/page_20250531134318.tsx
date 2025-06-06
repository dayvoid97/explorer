'use client'
import ExplorerPage from './explorer/page'
import WinPreviewGrid from './components/WinPreviewGrid'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <ExplorerPage />
      <WinPreviewGrid />
    </main>
  )
}
