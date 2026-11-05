'use client'

import { useEffect, useState } from 'react'

/**
 * New York time and the U.S. equity session, for the market strip.
 * Sessions: pre-market 4:00–9:30, open 9:30–16:00, after hours 16:00–20:00 ET,
 * weekdays. Exchange holidays are not modelled.
 */
function session(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const hh = parseInt(get('hour'), 10) % 24
  const mm = parseInt(get('minute'), 10)
  const minutes = hh * 60 + mm
  const weekday = !['Sat', 'Sun'].includes(get('weekday'))
  const status = !weekday
    ? 'Closed'
    : minutes >= 570 && minutes < 960
      ? 'Open'
      : minutes >= 240 && minutes < 570
        ? 'Pre-market'
        : minutes >= 960 && minutes < 1200
          ? 'After hours'
          : 'Closed'
  return { time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, status }
}

export default function MarketClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  if (!now) return <span className="tabular-nums text-white/50">New York --:--</span>
  const { time, status } = session(now)
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Open' ? 'bg-white' : 'border border-white/60'}`} aria-hidden />
      <span className="tabular-nums text-white">New York {time}</span>
      <span className="text-white/50">{status}</span>
    </span>
  )
}
