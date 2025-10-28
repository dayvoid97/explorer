import React from 'react'
import ExplorerPage from './explorer/page'
import BlogListPage from './blog/page'

import ChronoWExplorer from './chronoW/page'
export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-8 ">
      <BlogListPage />
    </div>
  )
}
