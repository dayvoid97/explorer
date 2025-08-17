import React from 'react'
import Link from 'next/link'
import { Trophy, ChevronRight, Crown } from 'lucide-react'

interface KnowledgeBottomCTAProps {
  totalChronologies: number
  show?: boolean
}

export const KnowledgeBottomCTA: React.FC<KnowledgeBottomCTAProps> = ({
  totalChronologies,
  show = true,
}) => {
  if (!show) return null

  return (
    <div className="mt-12 text-center p-8 bg-gradient-to-br from-black via-gray-900 to-black border-2 border-white rounded-xl shadow-2xl">
      <div className="flex justify-center items-center gap-3 mb-4">
        <Crown className="w-8 h-8 text-white" />
        <Trophy className="w-12 h-12 text-white" />
        <Crown className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-3xl font-black text-white mb-2 tracking-tight">ONLY Ws IN THE CHAT</h3>

      <div className="text-lg font-bold text-gray-300 mb-4 uppercase tracking-wider">
        Winners Study. Losers Hope.
      </div>

      <p className="text-white font-semibold mb-4 max-w-2xl mx-auto text-lg">
        <strong className="text-white">{totalChronologies} WINNING CHRONOLOGIES</strong> await you.
        <br />
        Study the patterns. Master the game. <strong>CLAIM YOUR GLORY.</strong>
      </p>

      <div className="text-sm text-gray-400 mb-6 font-medium uppercase tracking-wide">
        Knowledge = Power. Power = Victory. Victory = Glory.
      </div>

      <Link
        href="/profile"
        className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-gray-100 text-black text-xl font-black rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-black hover:border-gray-800 uppercase tracking-wide"
      >
        <Trophy className="w-6 h-6" />
        ENTER THE ARENA
        <ChevronRight className="w-6 h-6" />
      </Link>

      <div className="mt-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
        No Losses. Only Wins. Only Glory.
      </div>
    </div>
  )
}
