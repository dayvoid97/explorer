'use client'
import React from 'react'

interface LegalPolicy {
  id: string
  title: string
  content: string
}

interface LegalPoliciesProps {
  policies: LegalPolicy[]
  activePolicy: string
}

export default function LegalPolicies({ policies, activePolicy }: LegalPoliciesProps): JSX.Element {
  const currentPolicy = policies.find((policy) => policy.id === activePolicy)

  if (!currentPolicy) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Policy Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300">The requested policy could not be found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          {currentPolicy.title}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="legal-content">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {currentPolicy.content}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Contact Section */}
      <div className="mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Questions about this policy?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you have any questions or concerns, please don't hesitate to contact us.
          </p>
          <a href="mailto:sharma.kanchan3154@gmail.com">Contact Legal Team</a>
        </div>
      </div>
    </div>
  )
}

// Example usage with your content
export const samplePolicies: LegalPolicy[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `// Paste your Terms of Service content here
Terms of Service

Last Updated: [Date]

1. Acceptance of Terms
By accessing and using FinancialGurkha ("Service"), you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
[Your content here...]

// Add your full TOS content here`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `// Paste your Privacy Policy content here
Privacy Policy

Last Updated: [Date]

1. Information We Collect
[Your content here...]

// Add your full Privacy Policy content here`,
  },
  {
    id: 'eula',
    title: 'End User License Agreement',
    content: `// Paste your EULA content here
End User License Agreement

Last Updated: [Date]

1. Grant of License
[Your content here...]

// Add your full EULA content here`,
  },
  {
    id: 'copyright',
    title: 'Copyright and Trademark Policy',
    content: `// Paste your Copyright Policy content here
Copyright and Trademark Policy

Last Updated: [Date]

1. Intellectual Property Rights
[Your content here...]

// Add your full Copyright Policy content here`,
  },
]
