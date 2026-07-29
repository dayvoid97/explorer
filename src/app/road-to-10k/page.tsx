// app/road-to-10K/page.tsx

export default function RoadTo10KPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 max-w-2xl mx-auto">
      <header className="mb-10">
        <p className="text-xs tracking-widest text-zinc-500 uppercase mb-2">
          Day 1 of 45 · May 20, 2026
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Road to $10K</h1>
        <p className="text-zinc-400 mt-1 text-sm">$370 → $10,000 in 45 days</p>
      </header>

      {/* Progress */}
      <section className="mb-10">
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
          <span>$370</span>
          <span>3.7%</span>
          <span>$10,000</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '3.7%' }} />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Day', value: '1' },
          { label: 'Balance', value: '$370' },
          { label: 'To go', value: '$9,630' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className="text-xl font-medium">{value}</p>
          </div>
        ))}
      </section>

      {/* Daily Log */}
      <section className="mb-10">
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-4">Daily log</h2>
        <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-zinc-900">
            <span className="text-sm text-zinc-400">May 20</span>
            <span className="text-sm text-zinc-500 italic">Challenge begins</span>
            <span className="text-sm font-medium text-emerald-400">$370.00</span>
          </div>
          {/* Future entries go here */}
        </div>
      </section>

      {/* Notes / Strategy */}
      <section>
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-4">Today's focus</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400 min-h-[80px]">
          {/* Swap this out daily */}
          Day 1 — set the baseline. Figure out the primary income method.
        </div>
      </section>
    </main>
  )
}
