import React from 'react'
import ExplorerPage from './explorer/page'
import BlogListPage from './blog/page'

import ChronoWExplorer from './chronoW/page'
export default function Home() {
  return (
    <div className="min-h-screen  bg-[#3b3a3c]">
      <BlogListPage />
    </div>
  )
}
