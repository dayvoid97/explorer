// components/ChronologySelector.tsx
import React, { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'
import { Layers, Loader2, ArrowUpRight } from 'lucide-react'

interface ChronologySelectorProps {
  value: string | undefined
  onChange: (id: string) => void
}

export function ChronologySelector({ value, onChange }: ChronologySelectorProps) {
  const [list, setList] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchChronos() {
      setLoading(true)
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/manage`
        )
        const data = await res.json()
        if (res.ok) setList(data.chronologies || [])
      } catch (e) {
        console.error('Failed to fetch chronologies', e)
      } finally {
        setLoading(false)
      }
    }
    fetchChronos()
  }, [])

  return (
    <div className="space-y-1">
      {/* Label & Meta Header */}
      {/* <div className="flex items-center justify-between">
        <label className="text-[10px] text-white  uppercase tracking-[0.2em] flex  gap-2">
          <Layers className="w-3 h-3" /> Chain to Chronology
        </label>
        {loading && <Loader2 className="w-3 h-3 animate-spin text-zinc-600" />}
      </div> */}

      <div className="group relative">
        {!loading && list.length === 0 ? (
          /* Empty State: Simple Message + External Tab Button */
          <div className="flex items-center justify-between w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3">
            <span className="text-[11px] text-zinc-500 font-medium">
              Create a Chronology in Profile to Add
            </span>
            <button
              onClick={() => window.open('/chronology', '_blank')}
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
              title="Manage Chronologies"
            >
              <span className="text-[10px] font-bold uppercase tracking-tighter">Setup</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        ) : (
          /* Standard Select */
          <>
            <select
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 appearance-none cursor-pointer transition-colors disabled:opacity-50"
            >
              <option value="" className="bg-zinc-900 text-zinc-400">
                Standalone Post (No Chain) ↓
              </option>
              {list.map((chrono) => (
                <option key={chrono.id} value={chrono.id} className="bg-zinc-900 text-white">
                  {chrono.name}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
