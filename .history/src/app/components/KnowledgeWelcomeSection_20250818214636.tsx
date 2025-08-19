import React from 'react'
import Link from 'next/link'
import { BookOpen, Users, Trophy, TrendingUp, Brain, Target } from 'lucide-react'

interface KnowledgeWelcomeSectionProps {
  totalChronologies: number
  totalWins: number
  totalViews: number
  className?: string
}

export const KnowledgeWelcomeSection: React.FC<KnowledgeWelcomeSectionProps> = ({
  totalChronologies,
  totalWins,
  totalViews,
  className = '',
}) => {
  return (
    <div
      className={`mb-8 p-6 bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 border border-neutral-700 rounded-xl backdrop-blur-sm ${className}`}
    >
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Knowledge is Power in TRADE
          </h2>
          <p className="text-neutral-300 mb-4">
            ChronoDUBS is for the WINNERS. It's about WINNING in Life. Chronodubs is abnout{' '}
            <strong>learning from every trade</strong>. Study documented strategies, understand
            market patterns, and build your trading knowledge through real examples.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <Target className="w-4 h-4" />
              <span>Learn from winning strategies</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span>Study real trading decisions</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Brain className="w-4 h-4" />
              <span>Build pattern recognition</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{totalChronologies}</div>
              <div className="text-xs text-neutral-400">Learning Cases</div>
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{totalWins.toLocaleString()}</div>
              <div className="text-xs text-neutral-400">Documented Wins</div>
            </div>
          </div>
          <p className="text-sm text-neutral-400 mb-4">
            Join {Math.floor(totalViews / 1000)}K+ traders studying these strategies
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4" />
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  )
}
