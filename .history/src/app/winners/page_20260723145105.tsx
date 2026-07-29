// app/winners/page.tsx (Server Component)
// Frontend-only mode: /winners is a static hall of fame.
// The old API-driven win feed lives in git history — restore it when the backend returns.

import React from 'react'

// TODO: drop the real OnlyDubs URL in here when ready
const ONLYDUBS_URL = '#'

const serif: React.CSSProperties = {
  fontFamily: "'Freight Big Pro', serif",
  fontWeight: 800,
  letterSpacing: '-0.05rem',
}

const grotesk: React.CSSProperties = {
  fontFamily: "'Overused Grotesk', sans-serif",
  fontWeight: 500,
}

interface Winner {
  name: string
  tag: string
  body: string
  memoriam?: boolean
}

const WINNERS: Winner[] = [
  {
    name: 'Paul Graham',
    tag: 'The Essayist of Silicon Valley',
    body: 'Built Viaweb, sold it to Yahoo, then co-founded Y Combinator and rewired how the world funds young companies. Airbnb, Stripe, Dropbox, Reddit — thousands of startups trace their first check, and their first real advice, back to PG. His essays taught a generation to make something people want.',
  },
  {
    name: 'Jim Simons',
    tag: 'The Man Who Solved the Market · 1938–2024',
    body: 'World-class mathematician turned founder of Renaissance Technologies. The Medallion Fund posted returns no one else has ever come close to, decade after decade, by trusting data over ego. He then gave billions away to math and science education. The greatest quant who ever lived.',
  },
  {
    name: 'The Investors of Nepal',
    tag: 'From the Himalayas to the World',
    body: 'The traders of New Road, the SEBON pioneers, the NEPSE longs, the remitters who wire hard-earned money home and build businesses against every structural odd. Nepali capital is young, hungry, and rising — and Financial Gurkha exists because of it. Jai Nepal.',
  },
  {
    name: 'The Investors of Nigeria',
    tag: 'The Giants of African Capital',
    body: "Lagos moves markets. Nigeria's builders and investors have created banks, exchanges, and industries across an entire continent while the rest of the world was not paying attention. The most entrepreneurial energy per square mile anywhere on earth. Naija no dey carry last.",
  },
  {
    name: 'Arthur Rock',
    tag: 'The Man Who Funded Intel',
    body: "The original venture capitalist. He backed the 'traitorous eight' who founded Fairchild Semiconductor, then raised the money that launched Intel in a matter of days, and later wrote an early check into Apple. Silicon Valley has a money side, and Arthur Rock invented it.",
  },
  {
    name: 'Peter Thiel',
    tag: 'Zero to One',
    body: 'Co-founded PayPal, wrote the first outside check into Facebook, co-founded Palantir, and built Founders Fund. Loved and argued about in equal measure, but undeniable: he bets on secrets nobody else believes, and he collects.',
  },
  {
    name: 'Stanley Druckenmiller',
    tag: 'Three Decades, No Losing Year',
    body: "Ran Duquesne Capital for 30 years with roughly 30% average annual returns and not a single down year. Quarterbacked the 1992 trade that broke the Bank of England. The best risk manager in the history of macro trading — when Druck talks position sizing, you listen.",
  },
  {
    name: 'Ray Dalio',
    tag: 'The Principles Guy',
    body: 'Started Bridgewater from a two-bedroom apartment and built it into the largest hedge fund in the world. Turned his rules for markets and life into Principles and gave them away. Pain plus reflection equals progress.',
  },
  {
    name: 'Dr. Anatoly Kandel',
    tag: 'In Memoriam · Finance Professor, Caldwell University',
    body: 'My finance professor at Caldwell University, who recently passed away. The kind of teacher whose lessons outlive the classroom — a great deal of what this site believes about markets started in his lectures. Rest easy, Professor. This page is partly yours.',
    memoriam: true,
  },
  {
    name: 'Professor Anthony Annan',
    tag: 'Caldwell University → Georgetown',
    body: 'My finance professor at Caldwell University, now teaching at Georgetown. Proof that great teachers keep winning — and that the students they invested in carry the compounding forward. Thank you, Professor.',
  },
  {
    name: 'My Dad',
    tag: 'The Greatest Trade of All Time',
    body: 'Every investor on this list found an undervalued asset and held on. My dad found my mom. Unmatched deal sourcing, flawless execution, never sold. The single greatest W in the history of the family.',
  },
  {
    name: 'New York City',
    tag: 'The Capital of Capital',
    body: 'The city itself is a winner. Every currency, every asset, every ambition on the planet eventually clears through New York. It takes everyone, from everywhere, and gives them a shot. There is no list of winners without it.',
  },
]

export const metadata = {
  title: 'The Winners | Financial Gurkha',
  description:
    'A hall of fame for the biggest winners of life — from Jim Simons and Arthur Rock to the investors of Nepal and Nigeria, our professors, and New York City itself.',
}

export default function WinnersPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <header className="mb-16 text-center">
          <p className="uppercase tracking-widest text-sm text-gray-400 mb-4" style={grotesk}>
            Financial Gurkha is for the winners
          </p>
          <h1 className="text-5xl sm:text-7xl leading-none mb-6" style={serif}>
            THE WINNERS
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto" style={grotesk}>
            A hall of fame for the biggest Ws of life. Builders, traders, teachers, parents, and
            one city. Only dubs in the chat.
          </p>
        </header>

        {/* Winner cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WINNERS.map((w, i) => (
            <article
              key={w.name}
              className={`rounded-2xl border p-6 transition-transform duration-200 hover:scale-[1.02] ${
                w.memoriam
                  ? 'border-amber-400/60 bg-gradient-to-b from-amber-950/40 to-black'
                  : 'border-gray-800 bg-gradient-to-b from-gray-900 to-black'
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-gray-500 text-sm" style={grotesk}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {w.memoriam && (
                  <span
                    className="text-amber-300 text-xs uppercase tracking-widest"
                    style={grotesk}
                  >
                    In Memoriam
                  </span>
                )}
              </div>
              <h2 className="text-3xl mb-1" style={serif}>
                {w.name}
              </h2>
              <p
                className="text-sm uppercase tracking-wider text-gray-400 mb-4"
                style={grotesk}
              >
                {w.tag}
              </p>
              <p className="text-gray-200 leading-relaxed" style={grotesk}>
                {w.body}
              </p>
            </article>
          ))}
        </section>

        {/* ONLYDUBS promo */}
        <section className="mt-16 rounded-3xl border border-green-500/50 bg-gradient-to-br from-green-950/50 via-black to-black p-8 sm:p-12 text-center">
          <p className="uppercase tracking-widest text-xs text-green-400 mb-3" style={grotesk}>
            For the winners, by the winners
          </p>
          <h2 className="text-4xl sm:text-6xl mb-4" style={serif}>
            ONLYDUBS
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-3" style={grotesk}>
            Winners keep receipts. OnlyDubs is where you store yours — your wins, your milestones,
            your proof of work.
          </p>
          <p className="text-lg text-green-300 max-w-2xl mx-auto mb-8" style={grotesk}>
            Free storage for every user. Your dubs, saved forever, at no cost.
          </p>
          <a
            href={ONLYDUBS_URL}
            className="inline-block rounded-full bg-green-500 px-8 py-3 text-black text-lg font-bold hover:bg-green-400 transition"
            style={grotesk}
          >
            Claim your free storage
          </a>
        </section>
      </div>
    </div>
  )
}
