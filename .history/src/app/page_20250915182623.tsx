import React from 'react'
import ExplorerPage from './explorer/page'

import ChronoWExplorer from './chronoW/page'
export default function Home() {
  return (
    <div className="min-h-screen">
      <ExplorerPage />

      <ChronoWExplorer />
    </div>
  )
}
