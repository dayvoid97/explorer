'use client'

import React from 'react'
import { ExplorerItem } from '../hooks/useExplorersearch'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getToken, storeToken, isLoggedIn } from '../lib/auth'
import { launchCompanyCard } from '../hooks/useLaunchCompanyCard'
import { trackEvent } from '../lib/analytics'
import { useEffect } from 'react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'

interface ExplorerCardProps {
  item: ExplorerItem
  onRemove: (ticker: string) => void
  onSave?: (item: ExplorerItem) => void
}

export default function ExplorerCard({ item, onRemove, onSave }: ExplorerCardProps): JSX.Element {
  const router = useRouter()
  useEffect(() => {
    trackEvent('card_viewed', {
      ticker: item.ticker,
      companyName: item.companyName,
    })
  }, [])

  const handleMouseEnter = () => {
    trackEvent('card_hovered', {
      ticker: item.ticker,
      companyName: item.companyName,
    })
  }

  // const launchMyCard = () => {
  //   if (!isLoggedIn()) {
  //     router.push('/login')
  //   } else {
  //     const id = `${item.companyName}|${item.ticker}`
  //     router.push(`/explore/companycard/${encodeURIComponent(id)}/launch`)
  //   }
  // }

  const navigateToCompanyPage = () => {
    trackEvent('card_explored', {
      ticker: item.ticker,
      companyName: item.companyName,
    })

    const id = `${item.companyName}|${item.ticker}` // match Firestore docId format

    router.push(`/explore/companycard/${encodeURIComponent(id)}`)
  }

  const renderField = (label: string, value?: string) =>
    value ? (
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>{label}:</strong> {value}
      </p>
    ) : null

  return (
    <div className="relative p-6 border border-gray-200 rounded-xl shadow-md bg-white dark:bg-gray-900">
      {/* <div className="absolute top-3 right-3 flex gap-2">
        <button
          title="Keep"
          className="text-green-600 hover:text-green-800 transition"
          onClick={() => onSave?.(item)}
        >
          <CheckCircle size={20} />
        </button>
        <button
          title="Dismiss"
          className="text-red-600 hover:text-red-800 transition"
          onClick={() => onRemove(item.ticker)}
        >
          <XCircle size={20} />
        </button>
      </div> */}

      <h2 className="text-black-700 dark:text-white-400 text-xl font-semibold mb-3">
        {item.companyName} <span className="text-red-500">({item.ticker})</span>
      </h2>
      <div className="space-y-1">
        {renderField('Exchange', item.exchange)}
        {renderField('Primary Sector', item.primarySector)}
        {renderField('Industry Group', item.industryGroup)}
        {renderField('Country', item.country)}
        {renderField('Broad Group', item.broadGroup)}
        {renderField('SIC Code', item.sicCode)}
      </div>
      <div className="relative py-10">
        <button
          onClick={() => router.push('/about')}
          className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition"
          aria-label="Financial Gurkha MASTHEAD. Presented by Akash and Kanchan"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
