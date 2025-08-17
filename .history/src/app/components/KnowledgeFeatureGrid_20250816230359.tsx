import React from 'react'
import { Brain, BookOpen, TrendingUp, Users, Target, Eye } from 'lucide-react'

export const KnowledgeFeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />,
      title: 'Study Real Trades',
      description: 'Learn from documented decisions',
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      title: 'Pattern Recognition',
      description: 'Identify winning setups',
    },
    {
      icon: <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />,
      title: 'Strategy Analysis',
      description: 'Understand what works',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />,
      title: 'Market Insights',
      description: 'Track performance over time',
    },
    {
      icon: <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />,
      title: 'Community Learning',
      description: 'Learn from experienced traders',
    },
    {
      icon: <Eye className="w-8 h-8 text-indigo-400 mx-auto mb-2" />,
      title: 'Market Vision',
      description: 'Develop trading intuition',
    },
    {
      icon: <Eye className="w-8 h-8 text-indigo-400 mx-auto mb-2" />,
      title: 'Social Links',
      description: 'Develop trading intuition',
    },
  ]

  return (
    <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg text-center hover:bg-neutral-800/50 transition-colors"
        >
          {feature.icon}
          <h3 className="font-medium text-white mb-1">{feature.title}</h3>
          <p className="text-sm text-neutral-400">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
