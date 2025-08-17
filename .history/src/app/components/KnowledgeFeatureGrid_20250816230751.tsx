import React from 'react'
import {
  Brain,
  BookOpen,
  TrendingUp,
  Users,
  Target,
  Eye,
  DollarSign,
  ArrowRight,
} from 'lucide-react'

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
      description: 'Share your social media links to the crowd',
    },
    {
      icon: <DollarSign className="w-8 h-8 text-indigo-400 mx-auto mb-2" />,
      title: 'Make Money',
      description: 'Make Money Sharing Your Knowledge. Ad revenues coming soon.',
    },
    {
      icon: <ArrowRight className="w-8 h-8 text-emerald-400 mx-auto mb-2" />,
      title: 'Get Started Today',
      description: 'Join winning traders now',
      isCallToAction: true,
      link: '/winners',
    },
  ]

  return (
    <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`p-4 border rounded-lg text-center transition-all duration-200 cursor-pointer ${
            feature.isCallToAction
              ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/30 hover:border-emerald-400 transform hover:scale-105'
              : 'bg-neutral-800/30 border-neutral-700/50 hover:bg-neutral-800/50'
          }`}
          onClick={() => {
            if (feature.link) {
              window.location.href = feature.link
            }
          }}
        >
          {feature.icon}
          <h3
            className={`font-medium mb-1 ${
              feature.isCallToAction ? 'text-emerald-300' : 'text-white'
            }`}
          >
            {feature.title}
          </h3>
          <p
            className={`text-sm ${
              feature.isCallToAction ? 'text-emerald-200' : 'text-neutral-400'
            }`}
          >
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default KnowledgeFeatureGrid
