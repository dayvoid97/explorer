import React from 'react'
import Link from 'next/link'
import { Brain, ChevronRight } from 'lucide-react'

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
    <div className="mt-12 text-center p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl">
      <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-3">
        Ready to Level Up Your Trading Knowledge?
      </h3>
      <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
        Don't just trade—<strong>learn</strong>. Study {totalChronologies} real chronologies,
        understand winning patterns, and develop the skills that separate successful traders from
        the rest.
      </p>
      <p className="text-sm text-neutral-400 mb-6">
        Knowledge compounds. Every chronology you study makes you better.
      </p>
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Brain className="w-5 h-5" />
        Access the Knowledge Base
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  )
}
