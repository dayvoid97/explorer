'use client'

import { useEffect, useState } from 'react'

/**
 * Live New York clock + NYSE session status.
 * Part of the homepage masthead — reinforces "operating from New York City."
 */
export default function NycClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) {
    return (
      <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
        New York —:—:—
      </span>
    )
  }

  const nyParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
  }).formatToParts(now)

  const get = (type: string) => nyParts.find((p) => p.type === type)?.value ?? ''
  const hh = parseInt(get('hour'), 10)
  const mm = parseInt(get('minute'), 10)
  const weekday = get('weekday')
  const minutes = hh * 60 + mm
  const isWeekday = !['Sat', 'Sun'].includes(weekday)
  const open = isWeekday && minutes >= 570 && minutes < 960 // 9:30–16:00 ET

  return (
    <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-white/60 uppercase">
      <span>
        New York {get('hour')}:{get('minute')}
        <span className="text-white/30">:{get('second')}</span> ET
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            open ? 'bg-emerald-400 animate-pulse' : 'bg-red-400/80'
          }`}
        />
        <span className={open ? 'text-emerald-400' : 'text-white/40'}>
          {open ? 'NYSE Open' : 'NYSE Closed'}
        </span>
      </span>
    </span>
  )
}
