// components/auth/RecoverRequestForm.tsx
'use client'
import React from 'react'
import { Mail } from 'lucide-react'

interface Props {
  identifier: string
  setIdentifier: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export function RecoverRequestForm({ identifier, setIdentifier, onSubmit, loading }: Props) {
  return (
    <form onSubmit={onSubmit} className="animate-in fade-in space-y-8 duration-500">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
          Identity Verification
        </label>
        <input
          type="text"
          placeholder="EMAIL OR USERNAME"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-4 bg-zinc-950 border border-white/10 rounded-2xl text-white outline-none focus:border-green-500 text-sm font-bold uppercase tracking-widest"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Recovery Code'}
      </button>
    </form>
  )
}
