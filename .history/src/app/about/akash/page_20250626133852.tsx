'use client'

import React from 'react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header - About Me */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Akash Pariyar</p>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Founder | Analyst | Strategic Thinker
          </p>
        </header>

        {/* Introduction */}
        <section className="space-y-4">
          <p>
            Welcome to my corner of the financial web. I’m Akash Pariyar—a trader, strategist, and
            analytical thinker with a passion for decoding markets, building sustainable investment
            frameworks, and helping others see clarity where most see chaos.
          </p>
          <p>
            With an academic foundation in Political Science and History, and an MBA with a
            concentration in Business Analytics, I bring a multidisciplinary lens to the world of
            finance. Over the last four years, I’ve actively traded across asset classes, blending
            data-driven techniques with a deep understanding of macroeconomic and psychological
            market dynamics.
          </p>
        </section>

        {/* My Experience */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">My Experience</h2>
          <p>
            I’ve spent the better part of my professional life diving into the complexities of
            technical analysis, blockchain ecosystems, and quantitative modeling. Whether it’s
            dissecting company financials, running discounted cash flow (DCF) valuations, or
            building Solana-based token economies from the ground up, I’ve always approached markets
            with discipline, curiosity, and conviction.
          </p>
          <p className="font-semibold mt-6">My work often focuses on:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="font-semibold">Technical and Fundamental Analysis:</strong>{' '}
              Applying principles from Dow Theory, Elliott Wave, and John J. Murphy’s framework
              while grounding them in modern statistical reasoning.
            </li>
            <li>
              <strong className="font-semibold">
                Behavioral Finance and Psychology of Trading:
              </strong>{' '}
              Inspired by Mark Douglas’s Trading in the Zone, I emphasize mindset, consistency, and
              process over prediction.
            </li>
            <li>
              <strong className="font-semibold">Blockchain & Tokenomics:</strong> Designing
              token-based incentive systems, launching tokens and NFTs, and understanding the value
              mechanics behind decentralized finance.
            </li>
          </ul>
        </section>

        {/* Vision */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Vision</h2>
          <p>
            I believe financial literacy is a modern superpower—and it should be accessible,
            actionable, and free of noise. My goal is to build a platform that empowers individuals
            and emerging investors with institutional-grade insights, minus the institutional
            gatekeeping.
          </p>
          <p>
            Whether you’re trying to master chart patterns, assess a company’s balance sheet, or
            understand the real value of a crypto asset, I want this space to be your reliable and
            intellectually honest guide.
          </p>
        </section>

        {/* Ethos */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Ethos</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="font-semibold">Integrity Over Hype:</strong> I don’t chase trends.
              I study them, understand them, and help you make sense of their long-term
              significance.
            </li>
            <li>
              <strong className="font-semibold">Process Over Prediction:</strong> No one can time
              the market. But with the right process, you can control how you respond to it.
            </li>
            <li>
              <strong className="font-semibold">Skepticism + Open-Mindedness:</strong> I challenge
              assumptions—even my own. That’s where real insight begins.
            </li>
            <li>
              <strong className="font-semibold">Community &gt; Ego:</strong> I believe in
              collaborative learning. The markets are humbling, and no one gets it right alone.
            </li>
          </ul>
        </section>

        {/* Closing */}
        <section className="text-center space-y-4">
          <p>
            Thank you for visiting. I invite you to explore the site, engage with the content, and
            join a growing network of financially curious minds committed to mastering the art and
            science of money.
          </p>
          <p className="text-xl font-bold mt-6">Let’s decode the markets—together.</p>
        </section>
      </div>
    </main>
  )
}
