'use client'

import { useParams } from 'next/navigation'
import { usePublicCard } from '@/app/hooks/usePublicCard'
import { useRouter } from 'next/navigation'

export default function CompanyCardPublicPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: card, loading } = usePublicCard(id as string)

  // const AdBlock = () => (
  //   <div className="mt-6 w-full space-y-2">
  //     <p className="text-muted-foreground text-xs uppercase tracking-wide">Sponsored</p>
  //     <Image
  //       src={careerStaked}
  //       alt="Career Staked Promo"
  //       className="rounded-lg w-full h-auto object-cover"
  //       priority
  //     />
  //   </div>
  // )

  if (loading)
    return <div className="min-h-screen flex justify-center items-center text-lg">Loading...</div>
  if (!card) return <div className="text-center pt-20 text-gray-500">Card not found or private</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">{card.companyName}</h1>
        <p className="text-sm text-gray-500">
          {card.companyName} · Posted by{' '}
          <button
            onClick={() => router.push(`/publicprofile/${card.username}`)}
            className="text-blue-600 hover:underline"
          >
            @{card.username}
          </button>
        </p>
      </div>

      <div className="space-y-6">
        {card.items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border shadow-sm bg-white dark:bg-zinc-900 space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>

            {item.categories && (
              <p className="text-xs text-gray-400">Category: {item.categories}</p>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            )}
            {/* Render paragraphs if available, otherwise fallback to content */}
            {Array.isArray(item.paragraphs) && item.paragraphs.length > 0 ? (
              <div className="space-y-3 text-base leading-relaxed text-gray-800 dark:text-gray-100">
                {item.paragraphs.map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            ) : item.content ? (
              <p className="whitespace-pre-line text-base text-gray-800 dark:text-gray-100">
                {item.content}
              </p>
            ) : null}
            {item.externalLink && (
              <a
                href={item.externalLink}
                className="inline-block text-sm text-blue-600 hover:underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                {item.externalLink}
              </a>
            )}
            {item.uploadedAt && (
              <p className="text-xs text-gray-400 pt-2">
                Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
