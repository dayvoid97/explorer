'use client'

import React from 'react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Financial Gurkha</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stocks isn't difficult. Trust me, I have a Masters in Finance.
          </p>
        </header>

        {/* Mission Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>Financial Gurkha is on a mission to be a one stop internet shop for investing.</p>
          <p>
            Financial Gurkha is built to empower everyday investors, researchers, and explorers to
            document, analyze, and share insights about global markets — one company card at a time.
            We combine structured data, personal notes, and community knowledge into a single
            dynamic interface.
          </p>
        </section>

        {/* Vision Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p>
            To become the go-to destination for exploring companies across sectors and borders —
            with an intuitive search engine, rich media uploads, and verified user contributions. We
            aim to bridge the gap between casual interest and deep research.
          </p>
        </section>

        {/* Creator Credit */}
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold">A Kanchan Sharma Production</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Born in Nepal, raised in the US.
          </p>
        </section>
      </div>
    </main>
  )
}
