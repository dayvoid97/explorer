// components/QuickPostGuestLander.tsx
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Sparkles, UserPlus, LogIn, Zap } from 'lucide-react'

export function QuickPostGuestLander() {
  const router = useRouter()

  return (
    <div className="animate-in fade-in zoom-in p-8 flex flex-col items-center text-center space-y-8 duration-300">
      {/* Visual Icon Group */}
      <div className="relative">
        <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center border border-green-500/20">
          <Trophy className="w-10 h-10 text-green-500" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 text-blue-400 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">
          Join the Archive
        </h3>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-[260px] mx-auto">
          Sign up to post your own Dubs, track your chronology, and influence the global trends.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={() => router.push('/signup')}
          className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
        >
          <UserPlus className="w-5 h-5" />
          Create Account
        </button>

        <button
          onClick={() => router.push('/login')}
          className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-black uppercase italic border border-white/5 flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all"
        >
          <LogIn className="w-5 h-5" />
          Sign In
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
        <Zap size={12} /> Takes less than 30 seconds
      </div>
    </div>
  )
}
