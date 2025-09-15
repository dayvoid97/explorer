import React from 'react'
import ExplorerPage from './explorer/page'
import Explore from './winners/Explore'
export default function Home() {
  return (
    <div className="min-h-screen">
      <ExplorerPage />
      <Explore />
    </div>
  )
}
