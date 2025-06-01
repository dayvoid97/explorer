'use client'

import { useParams } from 'next/navigation'
import { usePublicCard } from '@/app/hooks/usePublicCard'
import { useRouter } from 'next/navigation'

export default function CompanyCardPublicPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: card, loading } = usePublicCard(id as string)

  if (loading)
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>
  if (!card) return <div className="text-center pt-20">Card not found or private</div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{card.cardTicker}</h1>
        <p className="text-muted-foreground text-sm">
          {card.companyName} · Posted by @{card.username}
        </p>
      </div>

      <div className="space-y-6">
        {card.items.map((item, idx) => (
          <div key={idx} className="p-4 border rounded-xl space-y-1">
            <h3 className="font-semibold">{item.title}</h3>
            {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
            {item.content && <p>{item.content}</p>}
            {item.externalLink && (
              <a
                href={item.externalLink}
                className="text-sm text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {item.externalLink}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
