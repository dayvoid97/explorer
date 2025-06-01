'use client'

import React from 'react'
import { ExplorerItem } from '../hooks/useExplorersearch'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getToken, storeToken, isLoggedIn } from '../lib/auth'
import { launchCompanyCard } from '../hooks/useLaunchCompanyCard'
import { trackEvent } from '../lib/analytics'
import { useEffect } from 'react'
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

      <h2 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">
        {item.companyName} <span className="text-gray-500">({item.ticker})</span>
      </h2>
      <div className="space-y-1">
        {renderField('Exchange', item.exchange)}
        {renderField('Primary Sector', item.primarySector)}
        {renderField('Industry Group', item.industryGroup)}
        {renderField('Country', item.country)}
        {renderField('Broad Group', item.broadGroup)}
        {renderField('SIC Code', item.sicCode)}
      </div>
      <div className="relative top-3 right-3 flex gap-10">
        <button
          title="Explore"
          className="text-green-600 hover:text-green-800 transition px-4 py-2 bg-green-100 rounded-lg"
          onClick={navigateToCompanyPage}
        >
          <p>Explore {item.ticker} Company Card</p>
        </button>
        <button title="Launch" className="hover:text-green-800 transition px-4 py-2 rounded-lg">
          Launch my {item.ticker} Card
        </button>
      </div>
    </div>
  )
}
