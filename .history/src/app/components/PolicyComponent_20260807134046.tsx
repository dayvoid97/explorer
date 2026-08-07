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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          {currentPolicy.title}
        </h1>
        <div className="w-100 h-1 bg-black  mx-auto rounded-full"></div>
      </div>

      {/* Content */}
      <div>
        <div className="p-8">
          <div className="prose ">
            <div className="legal-content">
              <pre className=" text-sm leading-relaxed font-sans">{currentPolicy.content}</pre>
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
        <div className=" rounded-2xl p-8 border border-blue-100  text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Questions about this policy?</h3>
          <p className="text-gray-600  mb-6">
            If you have any questions or concerns, please don't hesitate to contact us.
          </p>
          <a href="mailto:contact@kanchanksharma.com">Contact Legal Team</a>
        </div>
      </div>
    </div>
  )
}
