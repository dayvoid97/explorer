import React from 'react';
import { ChevronRight, TrendingUp, Users, MessageCircle, Calendar, Target } from 'lucide-react';

export interface CentralBankInfo {
  name: string;
  country: string;
  abbreviation: string;
  currentRate: string;
  lastChange: string;
  nextMeeting: string;
  mandate: string;
  governor: string;
  established: string;
  headquarters: string;
  primaryObjective: string;
  inflationTarget: string;
  keyPolicies: string[];
  website: string;
  discussionCount?: number;
  trendingTopics?: string[];
  recentPosts?: number;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  marketImpact?: string;
}

interface CentralBankDirectivesProps {
  banks: CentralBankInfo[];
}

const CentralBankDirectives: React.FC<CentralBankDirectivesProps> = ({ banks }) => {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 dark:text-green-400';
      case 'bearish': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const handleCardClick = (bankAbbr: string) => {
    // Navigate to central bank specific page
    window.location.href = `/central-banks/${bankAbbr.toLowerCase()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🏦 Central Bank Watch</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track monetary policy and community discussions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banks.map((bank) => (
          <div
            key={bank.abbreviation}
            onClick={() => handleCardClick(bank.abbreviation)}
            className="group cursor-pointer border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {bank.abbreviation}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {bank.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {bank.country}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>

              {/* Current Rate Highlight */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Current Rate
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {bank.currentRate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last: {bank.lastChange}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Governor & Next Meeting */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Governor:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {bank.governor}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Next:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {bank.nextMeeting}
                  </span>
                </div>
              </div>

              {/* Inflation Target */}
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Target:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {bank.inflationTarget}
                </span>
              </div>

              {/* Community Engagement */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Community Activity
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {bank.discussionCount || 0} discussions
                  </span>
                </div>
                
                {/* Trending Topics */}
                {bank.trendingTopics && bank.trendingTopics.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Trending:</p>
                    <div className="flex flex-wrap gap-1">
                      {bank.trendingTopics.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentiment */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Sentiment:</span>
                    <span className={`text-xs font-medium ${getSentimentColor(bank.sentiment)}`}>
                      {getSentimentIcon(bank.sentiment)} {bank.sentiment || 'neutral'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {bank.recentPosts || 0} recent posts
                  </span>
                </div>
              </div>

              {/* Key Policies Preview */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Key Policies:</p>
                <div className="flex flex-wrap gap-1">
                  {bank.keyPolicies.slice(0, 2).map((policy, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {policy}
                    </span>
                  ))}
                  {bank.keyPolicies.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{bank.keyPolicies.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Est. {bank.established}</span>
                <span>{bank.headquarters}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Join the discussion about monetary policy and central bank decisions
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
          Explore All Central Banks
        </button>
      </div>
    </div>
  );
};

export default CentralBankDirectives; 