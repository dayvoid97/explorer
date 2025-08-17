'use client'
import ExplorerPage from './explorer/page'
import WinPreviewGrid from './components/WinPreviewGrid'
import CardPreviewGrid from './components/CardPreviewGrid'
import StockPriceGrid from './components/StockPriceGrid'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <ExplorerPage />
      <CardPreviewGrid />
      <WinPreviewGrid />
    </main>
  )
}
