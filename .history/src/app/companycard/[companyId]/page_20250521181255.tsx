'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchCompanyData } from '@/app/lib/fetcher'
import { ExplorerItem } from '@/app/hooks/useExplorersearch'

export default function CompanyDetailPage() {
  const { companyId } = useParams()
  const [data, setData] = useState<ExplorerItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!companyId) return
    fetchCompanyData(companyId as string)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [companyId])

  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!data) return <p className="text-center text-gray-500">Loading company details...</p>

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        {data.companyName} ({data.ticker})
      </h1>
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Exchange:</strong> {data.exchange}
        </p>
        <p>
          <strong>Primary Sector:</strong> {data.primarySector}
        </p>
        <p>
          <strong>Industry Group:</strong> {data.industryGroup}
        </p>
        <p>
          <strong>Country:</strong> {data.country}
        </p>
        <p>
          <strong>Broad Group:</strong> {data.broadGroup}
        </p>
        <p>
          <strong>SIC Code:</strong> {data.sicCode}
        </p>
      </div>
    </main>
  )
}
