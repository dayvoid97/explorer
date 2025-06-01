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
          <p>Simply put, the vision is to be rich.</p>
          <p>
            Realistically, the vision is to make all the platform users rich. What good is the
            bread, right?
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We're Charging Ahead?</h2>
          <p>
            We have technical expertise. We have financial knowledge. We have passion and dedication
            and the time we need.
          </p>
          <p>We encourage everyone to try our the products and see what fits them.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Technical Ethos</h2>
          <p>
            Homemade technology. We build our own tools, from the ground up. We do use AI a lot to
            help us build. Who doesn't, right?
          </p>
          <p>We encourage everyone to try our the products and see what fits them.</p>
        </section>

        {/* Creator Credit */}
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold">A Kanchan Sharma Production</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Born in Nepal, raised in the US.
          </p>
        </section>
        <section>Download the Strum-Vibe Together App on the iOS App Store.</section>
      </div>
    </main>
  )
}
