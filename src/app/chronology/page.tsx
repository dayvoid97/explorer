'use client'

import MyChronologies from '../components/ChronoSettings'
import CreateChronoButton from '../components/CreateChronoButton'

export default function InboxPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 min-h-screen">
      {/* System Header */}
      <header className="group relative mb-12">
        {/* Decorative background element */}
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-transparent opacity-50" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 mb-2"></div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-black leading-none">
              Chronology <span className="text-zinc-800">Management</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium max-w-md border-l border-white/10 pl-4 mt-4">
              Chronologies make it easier and fun to post your dubs.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Contextual Stats or Metadata can go here if needed */}
            <div className="hidden lg:block text-right pr-4 border-r border-white/5">
              <CreateChronoButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Interface Area */}
      <div className="relative border border-white/5 bg-zinc-900/30 rounded-3xl p-2 backdrop-blur-sm">
        <div className="bg-[#090909] rounded-[1.4rem] overflow-hidden">
          <MyChronologies />
        </div>
      </div>

      {/* Footer System Info */}
    </main>
  )
}
