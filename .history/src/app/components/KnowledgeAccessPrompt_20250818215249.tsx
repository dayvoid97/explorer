import React from 'react'
import Link from 'next/link'
import { BookOpen, Brain, TrendingUp, Users, X, ChevronRight } from 'lucide-react'

interface KnowledgeAccessPromptProps {
  show: boolean
  interactionCount: number
  onDismiss: () => void
  totalChronologies?: number
  totalWins?: number
}

export const KnowledgeAccessPrompt: React.FC<KnowledgeAccessPromptProps> = ({
  show,
  interactionCount,
  onDismiss,
  totalChronologies = 0,
  totalWins = 0,
}) => {
  if (!show) return null

  const getPromptContent = () => {
    switch (interactionCount) {
      case 1:
        return {
          icon: <BookOpen className="w-5 h-5 text-blue-400" />,
          title: 'Unlock the Full Learning Experience',
          description: 'Join to save winning strategies and track your own knowledge journey',
          bgClass: 'bg-blue-900/20 border-blue-500/50',
          textClass: 'text-blue-200',
          subTextClass: 'text-blue-300/70',
        }
      case 2:
        return {
          icon: <Brain className="w-5 h-5 text-purple-400" />,
          title: "You're Missing Key Learning Tools",
          description: 'Create your own chronologies and learn from every trade',
          bgClass: 'bg-purple-900/20 border-purple-500/50',
          textClass: 'text-purple-200',
          subTextClass: 'text-purple-300/70',
        }
      default:
        return {
          icon: <TrendingUp className="w-5 h-5 text-green-400" />,
          title: 'Join the Knowledge Revolution',
          description: `${totalWins}+ documented wins waiting for you to study`,
          bgClass: 'bg-green-900/20 border-green-500/50',
          textClass: 'text-green-200',
          subTextClass: 'text-green-300/70',
        }
    }
  }

  const content = getPromptContent()

  return (
    <div
      className={`mb-6 p-4 border rounded-lg flex items-center justify-between transition-all duration-300 ${content.bgClass}`}
    >
      <div className="flex items-center gap-3">
        {content.icon}
        <div>
          <p className={`font-medium ${content.textClass}`}>{content.title}</p>
          <p className={`text-sm ${content.subTextClass}`}>{content.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Access Knowledge
          <ChevronRight className="w-3 h-3" />
        </Link>
        <button onClick={onDismiss} className="p-1 hover:bg-white/10 rounded transition-colors">
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>
    </div>
  )
}
