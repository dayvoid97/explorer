// components/auth/RecoverConfirmForm.tsx
'use client'
import React from 'react'

interface Props {
  code: string[]
  handleInput: (val: string, i: number) => void
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>
  newPass: string
  setNewPass: (val: string) => void
  confirmPass: string
  setConfirmPass: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export function RecoverConfirmForm({
  code,
  handleInput,
  inputsRef,
  newPass,
  setNewPass,
  confirmPass,
  setConfirmPass,
  onSubmit,
  loading,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="animate-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
          Authorization Code
        </label>
        <div className="flex justify-between gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(e.target.value, i)}
              className="w-full h-14 bg-zinc-950 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-green-500 outline-none transition-all"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
          New Security Phrase
        </label>
        <input
          type="password"
          placeholder="ENTER NEW PASSWORD"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full p-4 bg-zinc-950 border border-white/10 rounded-2xl text-white outline-none focus:border-green-500 text-sm font-bold uppercase tracking-widest"
          required
        />
        <input
          type="password"
          placeholder="CONFIRM NEW PASSWORD"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full p-4 bg-zinc-950 border border-white/10 rounded-2xl text-white outline-none focus:border-green-500 text-sm font-bold uppercase tracking-widest"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Authorize Reset'}
      </button>
    </form>
  )
}
